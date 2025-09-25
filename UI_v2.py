import streamlit as st
import pandas as pd

NOTES = "A A# B C C# D D# E F F# G G#".split()

def note_string_builder(string_start: str, number_of_frets: int = 12):
    start_index = NOTES.index(string_start)
    return [NOTES[(start_index + i) % len(NOTES)] for i in range(number_of_frets + 1)]

def tuning_selector(tuning: str, number_of_frets: int = 15):
    tuned = {}
    for note in tuning.split():
        original_note = note
        counter = 1
        while note in tuned:
            note = f"{original_note}{counter}"
            counter += 1
        tuned[note] = note_string_builder(original_note, number_of_frets)
    return tuned

if "selected_notes" not in st.session_state:
    st.session_state.selected_notes = []

def add_note(note: str):
    st.session_state.selected_notes.append(note)

def clear_notes():
    st.session_state.selected_notes = []

# Layout
col1, col2 = st.columns([2, 1])

with col1:
    tuning = st.text_input("Enter Tuning (6 strings, space separated)", value="E A D G B E")
    fretboard_map = tuning_selector(tuning)
    df = pd.DataFrame(fretboard_map)

    st.write("### Guitar Fretboard (Click Fret Numbers) ")

    # Header row with string names
    header_cols = st.columns(len(df.columns))
    for idx, string_name in enumerate(df.columns):
        header_cols[idx].markdown(f"**{string_name}**", unsafe_allow_html=True)

    # Render fretboard
    for fret in df.index:
        cols = st.columns(len(df.columns))
        for j, string in enumerate(df.columns):
            note = df.iloc[fret, j]
            label = str(fret)

            if cols[j].button(label, key=f"button_{note}_{fret}_{j}"):
                add_note(note)

# Selected Notes Display
with col2:
    st.write("### Selected Notes ")
    if st.session_state.selected_notes:
        formatted = ""
        for i, n in enumerate(st.session_state.selected_notes, 1):
            formatted += n + " "
            if i % 10 == 0:
                formatted += "\n"
        st.text_area("Sequence", value=formatted.strip(), height=200)
    else:
        st.write("_No notes selected yet_")

    if st.button("Clear Notes", use_container_width=True):
        clear_notes()
        st.experimental_rerun()
