'use client';

import React, { useEffect, useState } from 'react';
import AdminPageShell from '@/components/AdminPageShell';
import { createMedia, deleteMedia, fetchMedia, fetchPosts, updateMedia, uploadMedia, type ApiMedia, type ApiPost } from '@/lib/api';
import { AdminGrid } from '../shared/AdminGrid';
import MediaForm from './MediaForm';
import MediaTable from './MediaTable';
import { emptyMediaForm, type MediaFormState } from './types';

export default function AdminMediaView() {
  const [items, setItems] = useState<ApiMedia[]>([]);
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [form, setForm] = useState<MediaFormState>(emptyMediaForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  async function load() {
    const [mediaData, postData] = await Promise.all([fetchMedia(), fetchPosts()]);
    setItems(mediaData);
    setPosts(postData);
  }

  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const postId = form.post_id ? Number(form.post_id) : null;
    const payload = {
      filename: form.filename,
      url: form.url,
      type: form.type || undefined,
      size: form.size ? Number(form.size) : null,
      post_id: postId,
    };

    try {
      if (form.file) {
        await uploadMedia(form.file, { post_id: postId, media_id: editingId });
      } else if (editingId) {
        await updateMedia(editingId, payload);
      } else {
        await createMedia(payload);
      }
      setForm(emptyMediaForm);
      setEditingId(null);
      setMessage(editingId ? 'Midia atualizada.' : 'Midia criada.');
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Falha ao salvar midia.');
    }
  }

  function edit(item: ApiMedia) {
    setEditingId(item.id);
    setMessage('');
    setForm({
      file: null,
      filename: item.filename,
      url: item.url,
      type: item.type || '',
      size: item.size ? String(item.size) : '',
      post_id: item.post_id ? String(item.post_id) : '',
    });
  }

  async function remove(item: ApiMedia) {
    await deleteMedia(item.id);
    await load();
  }

  return (
    <AdminPageShell active="media" title="Midia" eyebrow={`${items.length} arquivos`}>
      <AdminGrid>
        <MediaForm form={form} posts={posts} message={message} onChange={setForm} onSubmit={save} />
        <MediaTable items={items} onEdit={edit} onDelete={remove} />
      </AdminGrid>
    </AdminPageShell>
  );
}
