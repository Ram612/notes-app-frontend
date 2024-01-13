// src/components/NoteForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import './NoteForm.css';

interface NoteFormProps {
  onNoteAdded: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ onNoteAdded }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the title and content are not empty
    if (!title.trim() || !content.trim()) {
      console.error('Title and content are required.');
      return;
    }

    try {
      // Add CSRF token to the request header
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
      }

      await axios.post('http://localhost:3001/notes', {
        title,
        content,
      });

      onNoteAdded();

      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <div className="note-form-container">
      <h2>Create Note</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <br />
        <label>
          Content:
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Save Note</button>
      </form>
    </div>
  );
};

export default NoteForm;
