// src/components/NoteList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Note } from '../types';
import './NoteList.css';

const NoteList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortOrderTitle, setSortOrderTitle] = useState<'asc' | 'desc'>('asc');
  const [sortOrderCreatedAt, setSortOrderCreatedAt] = useState<'newest' | 'oldest'>('newest');
  const [selectedSortOption, setSelectedSortOption] = useState<'title' | 'createdAt'>('title');
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);

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

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/notes/${id}`);
      // After successful deletion, update the local state
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };


  const handleSortTitleToggle = () => {
    setSortOrderTitle((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    setSelectedSortOption('title');
  };

  const handleSortCreatedAtToggle = (option: 'newest' | 'oldest') => {
    setSortOrderCreatedAt(option);
    setSelectedSortOption('createdAt');
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (selectedSortOption === 'createdAt') {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrderCreatedAt === 'newest' ? dateB - dateA : dateA - dateB;
    } else {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      return sortOrderTitle === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
    }
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="notes-container">
      <h2>
        Notes{' '}
        <div className="button-container">
          <button onClick={handleSortTitleToggle} className={selectedSortOption === 'title' ? 'active' : ''}>
            Sort Title ({sortOrderTitle.toUpperCase()})
          </button>{' '}
          <select
            onChange={(e) => handleSortCreatedAtToggle(e.target.value as 'newest' | 'oldest')}
            value={sortOrderCreatedAt}
            className={selectedSortOption === 'createdAt' ? 'active' : ''}
          >
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

