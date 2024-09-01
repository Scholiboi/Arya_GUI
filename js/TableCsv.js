
class TableCsv {
  /**
   * @param {HTMLTableElement} root The table element which will display the CSV data.
   */
  constructor(root) {
    this.root = root;
  }

  /**
   * Clears existing data in the table and replaces it with new data.
   *
   * @param {string[][]} data A 2D array of data to be used as the table body
   * @param {string[]} headerColumns List of headings to be used
   */
  update(data, headerColumns = []) {
    this.clear();
    this.setHeader(headerColumns);
    this.setBody(data);
  }

  /**
   * Clears all contents of the table (incl. the header).
   */
  clear() {
    this.root.innerHTML = "";
  }

  /**
   * Sets the table header.
   *
   * @param {string[]} headerColumns List of headings to be used
   */
  setHeader(headerColumns) {
    this.root.insertAdjacentHTML(
      "afterbegin",
      `
              <thead>
                  <tr>
                      ${headerColumns.map((text) => `<th>${text}</th>`).join("")}
                  </tr>
              </thead>
          `
    );
  }

  /**
   * Sets the table body.
   *
   * @param {string[][]} data A 2D array of data to be used as the table body
   */
  setBody(data) {
    const rowsHtml = data.map((row) => {
      return `
                  <tr>
                      ${row.map((text) => `<td>${text}</td>`).join("")}
                  </tr>
              `;
    });

    this.root.insertAdjacentHTML(
      "beforeend",
      `
              <tbody>
                  ${rowsHtml.join("")}
              </tbody>
          `
    );
  }
}

localStorage.setItem('powerStatus', 'off');

document.addEventListener('DOMContentLoaded', function () {

  const powerButton = document.querySelector('.power');
  if (powerButton) {
    powerButton.addEventListener('click', function () {
      console.log("on");
      let key = 'powerStatus';
      let oldValue = localStorage.getItem(key);
      let value = oldValue == 'on' ? 'off' : 'on';
      localStorage.setItem(key, value);
      this.classList.toggle('clicked');
      const e = new StorageEvent('storage', {
        storageArea: window.localStorage,
        key,
        oldValue,
        newValue: value,
        url: window.location.href,
      });
      window.dispatchEvent(e);
    });
  }

  const tableRoot = document.querySelector("#csvRoot");
  const tableCsv = new TableCsv(tableRoot);
let intervalId;
  window.addEventListener('storage', function (e) {
    if (e.key === 'powerStatus') {
      if(e.newValue === 'on') {
      console.log("i is here");

      Papa.parse("./js/test.csv", {
        delimiter: ",",
        download: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data.slice(1);
          const header = results.data[0];
          tableCsv.setHeader(header);

          let currentIndex = 0;

           intervalId = setInterval(() => {
            if (currentIndex < data.length) {
              tableCsv.setBody([data[currentIndex]]);
              currentIndex++;
            } else {
              clearInterval(intervalId); // Stop the interval when all rows are loaded
            }
          }, 1000);
        }
      });
    }
    else if(e.newValue === 'off') {
if (intervalId) {
                    clearInterval(intervalId); // Stop adding new rows
                }
      tableCsv.clear();

    }
    }
  });
});