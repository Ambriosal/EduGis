import { getAllNotes, getNote, addNote, updateNote } from '../noteService';
import { Note } from '../../types/Note';

describe('noteService', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  //Fetch all notes, make sure that the service returns a list of all notes

  test('fetch all notes ', async () => {
    const mNotes: Note[] = [{ id: 1, text: 'Test note', status: 'Done' }];
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: async () => mNotes,
    } as Response);
    const result = await getAllNotes();
    expect(result).toEqual(mNotes);
    expect(fetch).toHaveBeenCalledWith('/api/notes/all');
  });
  //Fetch one note, make sure that the service returns a single note when given its ID

  test('return one note', async () => {
    const mNote: Note = { id: 1, text: ' one  note', status: 'In Progress' };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: async () => mNote,
    } as Response);
    const result = await getNote(1);
    expect(result).toEqual(mNote);
    expect(fetch).toHaveBeenCalledWith('/api/notes/get/1');
  });

  //Add a note, make sure that a new note can be added successfully

  test('post a note', async () => {
    const newNote: Omit<Note, 'id'> = { text: 'New', status: 'Not Completed' };
    const rnote: Note = { id: 2, text: 'New ', status: 'Not Completed' };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: async () => rnote,
    } as Response);
    const result = await addNote(newNote);
    expect(result).toEqual(rnote);
    expect(fetch).toHaveBeenCalledWith('/api/notes/add', expect.any(Object));
  });
  //Update a note, make sure that an existing note can be updated
  test('updates a note', async () => {
    const updateNoteObj: Note = { id: 1, text: 'update note', status: 'Done' };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: async () => updateNoteObj,
    } as Response);
    const result = await updateNote(updateNoteObj);
    expect(result).toEqual(updateNoteObj);
    expect(fetch).toHaveBeenCalledWith('/api/notes/update', expect.any(Object));
  });
  //Return an empty list, make sure that the service gives back an empty list if the server request fails
  test('return empty ', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: false,
    } as Response);
    const result = await getAllNotes();
    expect(result).toEqual([]);
    expect(fetch).toHaveBeenCalledWith('/api/notes/all');
  });
  //Fail to fetch one note, make sure that an error is thrown if getting one note from the server fails

  test('rejects if fetch fails', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: false,
    } as Response);
    await expect(getNote(1)).rejects.toThrow('HTTP error!');
    expect(fetch).toHaveBeenCalledWith('/api/notes/get/1');
  });
  //Fail to add a note, make sure that an error is thrown if adding a new note fails
  test('rejects on failed add note', async () => {
    const newNote: Omit<Note, 'id'> = { text: 'fail ' };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: false,
    } as Response);
    await expect(addNote(newNote)).rejects.toThrow('HTTP error! ');
    expect(fetch).toHaveBeenCalledWith('/api/notes/add', expect.any(Object));
  });
  //Fail to update a note, make sure that an error is thrown if updating a note fails
  test('updatenote error', async () => {
    const updateNoteObj: Note = { id: 1, text: 'fail update', status: 'In Progress' };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: false,
    } as Response);
    await expect(updateNote(updateNoteObj)).rejects.toThrow('HTTP error! ');
    expect(fetch).toHaveBeenCalledWith('/api/notes/update', expect.any(Object));
  });

  // -------------------------
  // Due date related tests
  // -------------------------

  test('fetch all notes includes dueDate', async () => {
    const mNotes: Note[] = [{ id: 1, text: 'With date', dueDate: '2025-12-31', status: 'Done' }];
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: async () => mNotes,
    } as Response);
    const result = await getAllNotes();
    expect(result).toEqual(mNotes);
    expect(result[0].dueDate).toBe('2025-12-31');
    expect(fetch).toHaveBeenCalledWith('/api/notes/all');
  });

  test('fetch single note includes dueDate', async () => {
    const mNote: Note = { id: 2, text: 'Single', dueDate: '2025-11-30', status: 'Not Completed' };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: async () => mNote,
    } as Response);
    const result = await getNote(2);
    expect(result).toEqual(mNote);
    expect(result.dueDate).toBe('2025-11-30');
    expect(fetch).toHaveBeenCalledWith('/api/notes/get/2');
  });

  test('post a note with dueDate sends dueDate in request body', async () => {
    const newNote: Omit<Note, 'id'> = { text: 'New', dueDate: '2025-10-10', status: 'Not Completed' };
    const rnote: Note = { id: 3, text: 'New', dueDate: '2025-10-10', status: 'Not Completed' };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: async () => rnote,
    } as Response);

    const result = await addNote(newNote);
    expect(result).toEqual(rnote);

    // inspect fetch call arguments to ensure dueDate was sent
    const calls = (fetch as jest.MockedFunction<typeof fetch>).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0][0]).toBe('/api/notes/add');
    const options = calls[0][1] as RequestInit;
    const body = options && options.body ? JSON.parse(options.body as string) : {};
    expect(body).toEqual(expect.objectContaining({ text: 'New', dueDate: '2025-10-10' }));
  });

  test('update note with dueDate sends dueDate in request body', async () => {
    const updateObj: Note = { id: 4, text: 'Update', dueDate: '2026-01-01', status: 'In Progress' };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: async () => updateObj,
    } as Response);

    const result = await updateNote(updateObj);
    expect(result).toEqual(updateObj);

    const calls = (fetch as jest.MockedFunction<typeof fetch>).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0][0]).toBe('/api/notes/update');
    const options = calls[0][1] as RequestInit;
    const body = options && options.body ? JSON.parse(options.body as string) : {};
    expect(body).toEqual(expect.objectContaining({ id: 4, dueDate: '2026-01-01' }));
  });
});
