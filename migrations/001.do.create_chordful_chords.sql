CREATE TABLE chordful_chords (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    artist Text not null,
    key TEXT NOT NULL,
    tuning TEXT NOT NULL,
    lyrics TEXT NOT NULL
);