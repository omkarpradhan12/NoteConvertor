from random import randint
from collections import OrderedDict

colored_notes = {}

NOTES = "A Bb B C C# D Eb E F F# G Ab".split()

def color_selector(note: str) -> str:
    '''Assign a consistent color to each note using a hash function.'''
    r = randint(0, 255)
    g = randint(0, 255)
    b = randint(0, 255)

    if not (0 <= r <= 255 and 0 <= g <= 255 and 0 <= b <= 255):
        raise ValueError("RGB values must be between 0 and 255.")

    note_hex = f"#{r:02X}{g:02X}{b:02X}"

    if note not in colored_notes:
        colored_notes[note] = note_hex

    return colored_notes


def note_string_builder(string_start: str, number_of_frets: int = 15):
    '''Build a list of notes for a string starting from string_start.'''
    start_index = NOTES.index(string_start)
    noted_string = [NOTES[(start_index + i) % len(NOTES)] for i in range(number_of_frets + 1)]
    colored_note_string=[{"note":note,"note_color":color_selector(note)[note]} for note in noted_string]
    return colored_note_string

def tuning_selector(tuning: str, number_of_frets: int = 15):
    '''Create a dictionary representing the tuning of the 6 String Guitar.'''
    tuned = {}
    for note in tuning.split():
        original_note = note
        counter = 1
        while note in tuned:
            note = f"{original_note}{counter}"
            counter += 1
        tuned[note] = note_string_builder(original_note, number_of_frets)
    return tuned


if __name__ == "__main__":
    print(tuning_selector("E"))
