// src/components/NoteApp.tsx
import React, { useState } from 'react';
import NoteList from './NoteList';
import NoteForm from './NoteForm';

const NoteApp: React.FC = () => {
  const [noteAdded, setNoteAdded] = useState<boolean>(false);

  const handleNoteAdded = () => {
    setNoteAdded(!noteAdded); // Toggle the state to trigger a re-fetch in NoteList
    console.log('Note added!');
  };

  return (
    <div>
      <NoteForm onNoteAdded={handleNoteAdded} />
      <NoteList key={noteAdded.toString()} />
    </div>
  );
};

export default NoteApp;
