import React, { useState } from 'react';
import { addNote } from '../services/noteService';
import { Note } from '../types/Note';

const AddNote: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState(''); // added for due date

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) return;

    // include dueDate in the request payload
    const newNote: Omit<Note, 'id'> = {
      text,
      status: 'not completed',
      dueDate: dueDate || undefined,
    };

    await addNote(newNote);
    setText('');
    setDueDate('');
    onRefresh();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Text</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter your note" />
      </div>

      <div>
        <label>Due Date</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>

      <button type="submit">Add Note</button>
    </form>
  );
};

export default AddNote;
