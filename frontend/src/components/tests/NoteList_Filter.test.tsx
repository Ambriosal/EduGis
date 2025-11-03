import '@testing-library/jest-dom';

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('../../services/noteService', () => ({
  getAllNotes: jest.fn(),
  updateNote: jest.fn(),
}));

import { getAllNotes } from '../../services/noteService';
import NoteList from '../NoteList';

describe('NoteList filtering feature', () => {
  beforeEach(() => {
    (getAllNotes as jest.Mock).mockResolvedValue([
      { id: 1, text: 'Task 1', status: 'done' },
      { id: 2, text: 'Task 2', status: 'in progress' },
      { id: 3, text: 'Task 3', status: 'not completed' },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  // test 1 - checking if dropdown render
  test('renders filter dropdown', async () => {
    render(<NoteList />);

    const dropdown = await screen.findByLabelText(/filter by status/i);
    expect(dropdown).toBeInTheDocument();

    const tasks = await screen.findAllByRole('listitem');
    expect(tasks.length).toBe(3);
  });

  // test 2 verifying filter for each status
  test('filters correctly for selected status', async () => {
    render(<NoteList />);
    const dropdown = await screen.findByLabelText(/filter by status/i);

    fireEvent.change(dropdown, { target: { value: 'done' } });

    await waitFor(() => {
      const visibleTasks = screen.getAllByRole('listitem');
      expect(visibleTasks.length).toBe(1);
      expect(visibleTasks[0]).toHaveTextContent('Task 1');
    });
  });

  // test 3 trying toshow all tasks when selecting all tasks again
  test('resets to show all tasks when filter is cleared', async () => {
    render(<NoteList />);
    const dropdown = await screen.findByLabelText(/filter by status/i);

    fireEvent.change(dropdown, { target: { value: 'in progress' } });

    await waitFor(() => {
      const visibleTasks = screen.getAllByRole('listitem');
      expect(visibleTasks.length).toBe(1);
      expect(visibleTasks[0]).toHaveTextContent('Task 2');
    });

    fireEvent.change(dropdown, { target: { value: '' } });

    await waitFor(() => {
      const visibleTasks = screen.getAllByRole('listitem');
      expect(visibleTasks.length).toBe(3);
    });
  });
});
