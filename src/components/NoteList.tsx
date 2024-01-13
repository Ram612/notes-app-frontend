// src/components/NoteList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Note } from '../types';
import NoteForm from './NoteForm';
import './NoteList.css';

const NoteList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null); // Keep track of the note to be deleted

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get<Note[]>('http://localhost:3001/notes');
        setNotes(response.data);
        setError(null);
      } catch (error) {
        setError('Error fetching notes. Please try again later.');
      }
    };

    fetchNotes();
  }, []);

  const handleNoteAdded = async () => {
    // Refresh the notes list after adding a new note
    try {
      const response = await axios.get<Note[]>('http://localhost:3001/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/notes/${id}`);
      // After successful deletion, update the local state
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleSortToggle = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleSortByToggle = (option: 'newest' | 'oldest') => {
    setSortBy(option);
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (sortBy === 'newest') {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateB - dateA : dateA - dateB;
    } else {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Adjust the format as needed
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="notes-container">
      <h2>
        Notes{' '}
        <div className="button-container">
          <button onClick={handleSortToggle}>
            Sort ({sortOrder.toUpperCase()})
          </button>{' '}
          <select onChange={(e) => handleSortByToggle(e.target.value as 'newest' | 'oldest')} value={sortBy}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </h2>
      <div className="note-list">
        {sortedNotes.map((note, index) => (
          <React.Fragment key={note.id}>
            {index > 0 && index % 5 === 0 && <div className="row-divider" />}
            <div className="note-card">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <button className="delete-button" onClick={() => handleDelete(note.id)}>
                Delete
              </button>
              <p>{formatDate(note.createdAt)}</p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default NoteList;
