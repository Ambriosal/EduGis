package com.example.cis4900.spring.template.notes;

import com.example.cis4900.spring.template.notes.dao.NotesDao;
import com.example.cis4900.spring.template.notes.models.Note;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;

class NotesServiceImplTest {

    @Mock
    private NotesDao notesDao;

    @InjectMocks
    private NotesServiceImpl notesService;

    private Note note1;
    private Note note2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        note1 = new Note(1, "Test Note 1", "not started");
        note2 = new Note(2, "Test Note 2", "in progress");
    }

    @Test
    void testAllNotes() {
        when(notesDao.findAll()).thenReturn(Arrays.asList(note1, note2));

        Iterable<Note> result = notesService.allNotes();

        assertNotNull(result);
        verify(notesDao, times(1)).findAll();
    }

    @Test
    void testGetNote() {
        when(notesDao.findById(1)).thenReturn(Optional.of(note1));

        Note result = notesService.getNote(1);

        assertNotNull(result);
        assertEquals("Test Note 1", result.getText());
        verify(notesDao, times(1)).findById(1);
    }

    @Test
    void testAddNote() {
        when(notesDao.save(any(Note.class))).thenReturn(note1);

        String result = notesService.addNote(note1);

        assertEquals("Saved", result);
        verify(notesDao, times(1)).save(note1);
    }

    @Test
    void testAddNoteWithException() {
        when(notesDao.save(any(Note.class))).thenThrow(new RuntimeException("Database error"));

        String result = notesService.addNote(note1);

        assertEquals("Database error", result);
        verify(notesDao, times(1)).save(note1);
    }

    @Test
    void testUpdateNote() {
        when(notesDao.save(any(Note.class))).thenReturn(note1);

        String result = notesService.updateNote(note1);

        assertEquals("Updated", result);
        verify(notesDao, times(1)).save(note1);
    }

    @Test
    void testUpdateNoteWithException() {
        when(notesDao.save(any(Note.class))).thenThrow(new RuntimeException("Update failed"));

        String result = notesService.updateNote(note1);

        assertEquals("Update failed", result);
        verify(notesDao, times(1)).save(note1);
    }

    @Test
    void testDeleteNote() {
        doNothing().when(notesDao).deleteById(1);

        String result = notesService.deleteNote(1);

        assertEquals("Deleted", result);
        verify(notesDao, times(1)).deleteById(1);
    }

    @Test
    void testDeleteNoteWithException() {
        doThrow(new RuntimeException("Delete failed")).when(notesDao).deleteById(1);

        String result = notesService.deleteNote(1);

        assertEquals("Delete failed", result);
        verify(notesDao, times(1)).deleteById(1);
    }

    @Test
    void testCount() {
        when(notesDao.getCount()).thenReturn(5);

        Integer result = notesService.count();

        assertEquals(5, result);
        verify(notesDao, times(1)).getCount();
    }

    // New tests for dueDate handling

    @Test
    void testGetNote_returnsDueDate() {
        note1.setDueDate(LocalDate.of(2025, 10, 23));
        when(notesDao.findById(1)).thenReturn(Optional.of(note1));

        Note result = notesService.getNote(1);

        assertNotNull(result);
        assertEquals(LocalDate.of(2025, 10, 23), result.getDueDate());
        verify(notesDao, times(1)).findById(1);
    }

    @Test
    void testAddNote_savesDueDate() {
        Note newNote = new Note(null, "Service test", "not started");
        LocalDate due = LocalDate.of(2025, 9, 30);
        newNote.setDueDate(due);

        when(notesDao.save(any(Note.class))).thenReturn(new Note(10, newNote.getText(), newNote.getStatus()));

        String res = notesService.addNote(newNote);

        assertEquals("Saved", res);
        ArgumentCaptor<Note> captor = ArgumentCaptor.forClass(Note.class);
        verify(notesDao, times(1)).save(captor.capture());
        assertEquals(due, captor.getValue().getDueDate());
    }

    @Test
    void testUpdateNote_preservesDueDate() {
        Note toUpdate = new Note(1, "Updated text", "in progress");
        LocalDate due = LocalDate.of(2025, 12, 31);
        toUpdate.setDueDate(due);

        when(notesDao.save(any(Note.class))).thenReturn(toUpdate);

        String res = notesService.updateNote(toUpdate);

        assertEquals("Updated", res);
        ArgumentCaptor<Note> captor = ArgumentCaptor.forClass(Note.class);
        verify(notesDao, times(1)).save(captor.capture());
        assertEquals(due, captor.getValue().getDueDate());
    }
}
