// Shared implementation of the page displaying a single profile benchmark.
// Each benchmark subfolder only contains a small index.html (copied from template_index.html)
// that loads this script, so that all the benchmarks pages share the same code.
'use strict';
(function() {
  const CHART_JS_URL = 'https://cdn.jsdelivr.net/npm/chart.js@2.9.2/dist/Chart.min.js';

  function renderLayout() {
    document.body.innerHTML = `
      <header id="header">
        <div class="header-item">
          <strong class="header-label">Last Update:</strong>
          <span id="last-update"></span>
        </div>
        <div class="header-item">
          <a class="back" href="../">&larr; Back to all benchmarks</a>
        </div>
      </header>
      <img id="thumbnail" class="benchmark-thumbnail" alt="Benchmark thumbnail" hidden />
      <main id="main"></main>
      <footer>
        <button id="dl-button">Download data as JSON</button>
        <div class="spacer"></div>
      </footer>`;

    const thumbnail = document.getElementById('thumbnail');
    thumbnail.onload = () => { thumbnail.hidden = false; };
    thumbnail.onerror = () => { thumbnail.remove(); };
    thumbnail.src = 'thumbnail.png';
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load ' + src));
      document.head.appendChild(script);
    });
  }

  // Colors from https://github.com/github/linguist/blob/master/lib/linguist/languages.yml
  const toolColors = {
    cargo: '#dea584',
    go: '#00add8',
    benchmarkjs: '#f1e05a',
    benchmarkluau: '#000080',
    pytest: '#3572a5',
    googlecpp: '#f34b7d',
    catch2: '#f34b7d',
    julia: '#a270ba',
    jmh: '#b07219',
    benchmarkdotnet: '#178600',
    customBiggerIsBetter: '#38ff38',
    customSmallerIsBetter: '#ff3838',
    _: '#008fff'
  };

  function init() {
    function collectBenchesPerTestCase(entries) {
      const map = new Map();
      for (const entry of entries) {
        const {timestamp, benches} = entry;
        for (const bench of benches) {
          const result = { timestamp, bench };
          const arr = map.get(bench.name);
          if (arr === undefined) {
            map.set(bench.name, [result]);
          } else {
            arr.push(result);
          }
        }
      }
      return map;
    }

    const data = window.BENCHMARK_DATA;

    // Render header
    document.getElementById('last-update').textContent = new Date(data.lastUpdate).toString();

    // Render footer
    document.getElementById('dl-button').onclick = () => {
      const dataUrl = 'data:,' + JSON.stringify(data, null, 2);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'benchmark_data.json';
      a.click();
    };

    // Prepare data points for charts
    return Object.keys(data.entries).map(name => ({
      name,
      dataSet: collectBenchesPerTestCase(data.entries[name]),
    }));
  }

  function renderAllChars(dataSets) {

    function renderGraph(parent, name, dataset) {
      const canvas = document.createElement('canvas');
      canvas.className = 'benchmark-chart';
      parent.appendChild(canvas);

      const color = toolColors['_'];
      const data = {
        labels: dataset.map(d => d.timestamp),
        datasets: [
          {
            label: name,
            data: dataset.map(d => d.bench.value),
            borderColor: color,
            backgroundColor: color + '60', // Add alpha for #rrggbbaa
          }
        ],
      };
      const options = {
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'timestamp',
              },
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: dataset.length > 0 ? dataset[0].bench.unit : '',
              },
              ticks: {
                beginAtZero: true,
              }
            }
          ],
        },
        tooltips: {
          callbacks: {
            afterTitle: items => {
              return '';
            },
            label: item => {
              let label = item.value;
              const { range, unit } = dataset[item.index].bench;
              label += ' ' + unit;
              if (range) {
                label += ' (' + range + ')';
              }
              return label;
            },
            afterLabel: item => {
              const { extra } = dataset[item.index].bench;
              return extra ? '\n' + extra : '';
            }
          }
        },
      };

      new Chart(canvas, {
        type: 'line',
        data,
        options,
      });
    }

    function renderBenchSet(name, benchSet, main) {
      const setElem = document.createElement('div');
      setElem.className = 'benchmark-set';
      main.appendChild(setElem);

      const nameElem = document.createElement('h1');
      nameElem.className = 'benchmark-title';
      nameElem.textContent = name;
      setElem.appendChild(nameElem);

      const graphsElem = document.createElement('div');
      graphsElem.className = 'benchmark-graphs';
      setElem.appendChild(graphsElem);

      for (const [benchName, benches] of benchSet.entries()) {
        renderGraph(graphsElem, benchName, benches)
      }
    }

    const main = document.getElementById('main');
    for (const {name, dataSet} of dataSets) {
      renderBenchSet(name, dataSet, main);
    }
  }

  function renderMetadata() {
    fetch('metadata.json')
      .then(r => {
        if (!r.ok) { throw new Error('HTTP ' + r.status); }
        return r.json();
      })
      .then(metadata => {
        const printerName = metadata && metadata.printer_name;
        if (typeof printerName !== 'string' || printerName.trim() === '') {
          return;
        }
        for (const titleElem of document.querySelectorAll('.benchmark-title')) {
          const descElem = document.createElement('p');
          descElem.className = 'benchmark-description';
          descElem.textContent = printerName;
          titleElem.insertAdjacentElement('afterend', descElem);
        }
      })
      .catch(() => {
        // Metadata is optional, silently ignore missing or invalid files
      });
  }

  renderLayout();
  loadScript(CHART_JS_URL)
    .then(() => loadScript('data.js'))
    .then(() => {
      renderAllChars(init()); // Start
      renderMetadata();
    })
    .catch(error => {
      const main = document.getElementById('main');
      main.textContent = 'Failed to load benchmark: ' + error.message;
    });
})();
