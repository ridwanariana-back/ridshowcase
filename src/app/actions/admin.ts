'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

// --- AUTH ---
export async function loginAdmin(formData: FormData): Promise<void> {
  const password = formData.get('password');
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    redirect('/admin/dashboard');
  }
  redirect('/admin/login?error=true');
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}

// --- HELPER UNTUK HAPUS FILE GAMBAR DARI FOLDER PUBLIC ---
async function removeImageFile(imageUrl: string) {
  // Abaikan kalau default image atau URL kosong
  if (!imageUrl || imageUrl === '/projects/default.jpg') return;

  try {
    // Ambil path lengkap file di server/komputer
    const filePath = path.join(process.cwd(), 'public', imageUrl);
    
    // Cek apakah file benar-benar ada di sistem, lalu hapus
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (err) {
    // Abaikan jika file tidak ditemukan
    console.log('File gambar tidak ditemukan atau gagal dihapus:', imageUrl);
  }
}

// --- CREATE PROJECT ---
export async function addProject(formData: FormData): Promise<void> {
  const title = formData.get('title') as string;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const techStackRaw = formData.get('techStack') as string;
  const imageFile = formData.get('imageFile') as File;

  let imageUrl = '/projects/default.jpg';

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'projects');

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, fileName), buffer);
    imageUrl = `/projects/${fileName}`;
  }

  await db.insert(projects).values({
    slug,
    title,
    shortDescEn: formData.get('shortDescEn') as string,
    shortDescId: formData.get('shortDescId') as string,
    longDescEn: formData.get('longDescEn') as string,
    longDescId: formData.get('longDescId') as string,
    techStack: techStackRaw.split(',').map((s) => s.trim()),
    databaseUsed: formData.get('databaseUsed') as string,
    demoUrl: formData.get('demoUrl') as string,
    imageUrl,
  });

  revalidatePath('/');
  redirect('/admin/projects');
}

// --- UPDATE PROJECT (OTOMATIS HAPUS GAMBAR LAMA JIKA ADA GAMBAR BARU) ---
export async function updateProject(id: number, oldImageUrl: string, formData: FormData): Promise<void> {
  const title = formData.get('title') as string;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const techStackRaw = formData.get('techStack') as string;
  const imageFile = formData.get('imageFile') as File;

  let imageUrl = oldImageUrl;

  // Jika user mengupload file gambar baru
  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'projects');

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, fileName), buffer);
    imageUrl = `/projects/${fileName}`;

    // Hapus file gambar lama agar tidak jadi sampah di folder public
    await removeImageFile(oldImageUrl);
  }

  await db.update(projects).set({
    slug,
    title,
    shortDescEn: formData.get('shortDescEn') as string,
    shortDescId: formData.get('shortDescId') as string,
    longDescEn: formData.get('longDescEn') as string,
    longDescId: formData.get('longDescId') as string,
    techStack: techStackRaw.split(',').map((s) => s.trim()),
    databaseUsed: formData.get('databaseUsed') as string,
    demoUrl: formData.get('demoUrl') as string,
    imageUrl,
  }).where(eq(projects.id, id));

  revalidatePath('/');
  redirect('/admin/projects');
}

// --- DELETE PROJECT (OTOMATIS HAPUS GAMBAR DARI FOLDER PUBLIC) ---
export async function deleteProject(id: number): Promise<void> {
  // 1. Cari data proyek di DB untuk mendapatkan path gambar
  const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

  if (project) {
    // 2. Hapus file gambarnya dari folder public/projects
    await removeImageFile(project.imageUrl);

    // 3. Hapus data dari database Neon
    await db.delete(projects).where(eq(projects.id, id));
  }

  revalidatePath('/');
  redirect('/admin/projects');
}