'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';

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

// --- HELPER UNTUK HAPUS FILE GAMBAR DARI VERCEL BLOB ---
async function removeImageFile(imageUrl: string) {
  if (!imageUrl || imageUrl === '/projects/default.jpg' || !imageUrl.startsWith('http')) return;

  try {
    await del(imageUrl);
  } catch (err) {
    console.log('Gagal menghapus file blob:', imageUrl);
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
    const blob = await put(`projects/${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`, imageFile, {
      access: 'public',
    });
    imageUrl = blob.url;
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

// --- UPDATE PROJECT ---
export async function updateProject(id: number, oldImageUrl: string, formData: FormData): Promise<void> {
  const title = formData.get('title') as string;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const techStackRaw = formData.get('techStack') as string;
  const imageFile = formData.get('imageFile') as File;

  let imageUrl = oldImageUrl;

  if (imageFile && imageFile.size > 0) {
    const blob = await put(`projects/${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`, imageFile, {
      access: 'public',
    });
    imageUrl = blob.url;

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

// --- DELETE PROJECT ---
export async function deleteProject(id: number): Promise<void> {
  const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

  if (project) {
    await removeImageFile(project.imageUrl);
    await db.delete(projects).where(eq(projects.id, id));
  }

  revalidatePath('/');
  redirect('/admin/projects');
}