package com.example.cis4900.spring.template.controller;

import com.example.cis4900.spring.template.notes.models.Note;
import com.example.cis4900.spring.template.notes.NotesService;
import com.example.cis4900.spring.template.controllers.NotesController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

class NotesControllerTest {

    @Mock
    private NotesService notesService;

    @InjectMocks
    private NotesController notesController;

    private Note note1;
    private Note note2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        note1 = new Note(1, "Test Note 1", "not started");
        note1.setDueDate(LocalDate.of(2025, 10, 23));
        note2 = new Note(2, "Test Note 2", "in progress");
        note2.setDueDate(LocalDate.of(2025, 11, 1));
    }

    @Test
    void testGetAllNotes() {
        when(notesService.allNotes()).thenReturn(Arrays.asList(note1, note2));

        Iterable<Note> result = notesController.allNotes();

        assertNotNull(result);
        verify(notesService, times(1)).allNotes();
    }

    @Test
    void testAddNote() {
        when(notesService.addNote(any(Note.class))).thenReturn("Saved");

        ResponseEntity<HashMap<String, String>> response = notesController.addNote(note1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Saved", response.getBody().get("status"));
        verify(notesService, times(1)).addNote(note1);
    }

    @Test
    void testGetNote() {
        when(notesService.getNote(1)).thenReturn(note1);

        Note result = notesController.getNote(1);

        assertNotNull(result);
        assertEquals("Test Note 1", result.getText());
        verify(notesService, times(1)).getNote(1);
    }

    @Test
    void testUpdateNote() {
        when(notesService.updateNote(any(Note.class))).thenReturn("Updated");

        ResponseEntity<HashMap<String, String>> response = notesController.updateNote(note1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Updated", response.getBody().get("status"));
        verify(notesService, times(1)).updateNote(note1);
    }

    @Test
    void testDeleteNote() {
        when(notesService.deleteNote(1)).thenReturn("Deleted");

        String result = notesController.deleteNote(1);

        assertEquals("Deleted", result);
        verify(notesService, times(1)).deleteNote(1);
    }

    @Test
    void testCount() {
        when(notesService.count()).thenReturn(2);

        Integer result = notesController.count();

        assertEquals(2, result);
        verify(notesService, times(1)).count();
    }


    @Test
    void testAddNote_withDueDate() {
        when(notesService.addNote(any(Note.class))).thenReturn("Saved");

        Note toAdd = new Note(null, "New note", "not started");
        toAdd.setDueDate(LocalDate.of(2025, 12, 5));
        notesController.addNote(toAdd);

        ArgumentCaptor<Note> captor = ArgumentCaptor.forClass(Note.class);
        verify(notesService, times(1)).addNote(captor.capture());
        assertEquals(LocalDate.of(2025, 12, 5), captor.getValue().getDueDate());
    }

    @Test
    void testUpdateNote_dueDatePreserved() {
        when(notesService.updateNote(any(Note.class))).thenReturn("Updated");

        Note toUpdate = new Note(1, "Updated text", "in progress");
        toUpdate.setDueDate(LocalDate.of(2025, 12, 31));
        notesController.updateNote(toUpdate);

        ArgumentCaptor<Note> captor = ArgumentCaptor.forClass(Note.class);
        verify(notesService, times(1)).updateNote(captor.capture());
        assertEquals(LocalDate.of(2025, 12, 31), captor.getValue().getDueDate());
    }
}