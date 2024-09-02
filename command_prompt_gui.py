import PySimpleGUI as sg
import subprocess

def run_command(command):
    """Execute the command and return the output."""
    try:
        # Execute the command and capture the output
        result = subprocess.run(command, shell=True, text=True, capture_output=True)
        output = result.stdout + result.stderr
        
        # Check if the command was not found
        if result.returncode != 0:
            output = f"Command failed with error:\n{output}"
        
        return output
    except Exception as e:
        return f"Error: {str(e)}"

# Define the window layout
layout = [
    [sg.Text('Enter Command:')],
    [sg.InputText(key='-COMMAND-', size=(50, 1))],
    [sg.Button('Run'), sg.Button('Clear'), sg.Button('Exit')],
    [sg.Text('Output:')],
    [sg.Multiline(size=(80, 20), key='-OUTPUT-', disabled=True)]
]

# Create the window
window = sg.Window('Command Prompt GUI', layout)

# Event loop
while True:
    event, values = window.read()

    if event in (sg.WINDOW_CLOSED, 'Exit'):
        break
    elif event == 'Run':
        command = values['-COMMAND-']
        if command.strip():  # Check if the command is not empty
            output = run_command(command)
            window['-OUTPUT-'].update(output)
            window['-COMMAND-'].update('')  # Clear the input field
        else:
            window['-OUTPUT-'].update("Please enter a command.")
    elif event == 'Clear':
        window['-OUTPUT-'].update('')  # Clear the output area

# Close the window
window.close()