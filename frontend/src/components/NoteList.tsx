import React, { useEffect, useState } from 'react';
import { getAllNotes, updateNote } from '../services/noteService';
import { Note } from '../types/Note';

const NoteList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>(''); // new

  // Fetch all notes on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notes = await getAllNotes();
        console.log('Fetched notes:', notes);
        if (Array.isArray(notes)) {
          setNotes(notes);
        } else {
          setError('Failed to fetch notes');
        }
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError('Failed to fetch notes');
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // Update note status
  const handleStatusChange = async (note: Note, newStatus: string) => {
    try {
      const updatedNotes = notes.map((n) => (n.id === note.id ? { ...n, status: newStatus } : n));
      setNotes(updatedNotes);

      const updatedNote = { ...note, status: newStatus };
      await updateNote(updatedNote);
    } catch (err) {
      console.error('Error updating note:', err);
      setError('Failed to update note');
    }
  };

  // Sort notes by status or due date
  // Sort notes by status or due date
  const sortedNotes = [...notes].sort((a, b) => {
    if (sortBy === 'dueDate') {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return dateA - dateB;
    } else if (sortBy === 'status') {
      const statusOrder = ['not completed', 'in progress', 'done'];
      const indexA = statusOrder.indexOf(a.status?.toLowerCase() || '');
      const indexB = statusOrder.indexOf(b.status?.toLowerCase() || '');
      return indexA - indexB;
    }
    return 0;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* Filter and Sort Controls */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="statusFilter">Filter by status: </label>
        <select id="statusFilter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All</option>
          <option value="not completed">Not Completed</option>
          <option value="in progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        &nbsp;&nbsp;&nbsp;
        <label htmlFor="sortBy">Sort by: </label>
        <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">None</option>
          <option value="status">Status</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>

      <h2>All Notes</h2>

      <ul>
        {sortedNotes
          .filter((note) => !filterStatus || note.status === filterStatus)
          .map((note) => (
            <li key={note.id} style={{ marginBottom: '0.5rem' }}>
              <p>
                <strong>{note.text}</strong>
                &nbsp;|&nbsp;
                <em>Status:</em>{' '}
                <select
                  value={note.status || 'not completed'}
                  onChange={(e) => handleStatusChange(note, e.target.value)}
                >
                  <option value="not completed">Not Completed</option>
                  <option value="in progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                &nbsp;|&nbsp;
                <em>Due:</em> {note.dueDate ? new Date(note.dueDate).toLocaleDateString() : 'No due date'}
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default NoteList;
