document.getElementById('commandInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        var inputText = this.value.toLowerCase();
        var outputBox = document.getElementById('outputBox');

        // Handle 'power on' command
        if (inputText === 'power on') {
            localStorage.setItem('powerStatus', 'on');
            outputBox.textContent = 'Power is now ON.';
        }
        // Handle 'power off' command
        else if (inputText === 'power off') {
            localStorage.setItem('powerStatus', 'off');
            outputBox.textContent = 'Power is now OFF.';
        }
        // Check current power status
        else if (inputText === 'check power') {
            var powerStatus = localStorage.getItem('powerStatus') || 'off';
            outputBox.textContent = 'Power is currently ' + powerStatus.toUpperCase() + '.';
        }
        else if (inputText === 'cmd echo') {
            var prevCommand = localStorage.getItem('prevCommand') || 'no previous command found';
            outputBox.textContent = prevCommand;
        }
        // Handle unrecognized commands
        else {
            outputBox.textContent = 'Unrecognized command.';
        }
        // Save the command
        localStorage.setItem('prevCommand', inputText);
    }
});