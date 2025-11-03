package com.example.cis4900.spring.template.controllers;

import com.example.cis4900.spring.template.notes.NotesService;
import com.example.cis4900.spring.template.notes.models.Note;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;

@RestController
@RequestMapping(path = "/api/notes")
public class NotesController {
    private NotesService notesService;

    @Autowired
    NotesController(NotesService notesService) {
        this.notesService = notesService;
    }

    @PostMapping("/add")
    public ResponseEntity<HashMap<String, String>> addNote(@RequestBody Note newNote) {
        String res = notesService.addNote(newNote);
        HashMap<String, String> response = new HashMap<>();
        response.put("status", res);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get/{id}")
    public @ResponseBody Note getNote(@PathVariable Integer id) {
        return notesService.getNote(id);
    }

    @PutMapping("/update")
    public ResponseEntity<HashMap<String, String>> updateNote(@RequestBody Note updatedNote) {
        String res = notesService.updateNote(updatedNote);
        HashMap<String, String> response = new HashMap<>();
        response.put("status", res);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public @ResponseBody String deleteNote(@PathVariable Integer id) {
        return notesService.deleteNote(id);
    }

    @GetMapping("/all")
    public @ResponseBody Iterable<Note> allNotes() {
        return notesService.allNotes();
    }

    @GetMapping("/count")
    public @ResponseBody Integer count() {
        return notesService.count();
    }
}