var input;
var data;
var dataStd;
var labels;
var dataStd;
var covarianceMatrix;
var PC1;
var PC2;
var PC3;
const colors = {};
BreastCancer();
function ownDataset() {
  document.getElementById("breastCancer").style.backgroundColor =
    "rgba(255, 255, 255, 0.6)";
  document.getElementById("MNIST").style.backgroundColor =
    "rgba(255, 255, 255, 0.6)";
  document.getElementById("ownDataset").style.backgroundColor =
    "rgba(0, 255, 0, 0.6)";
  //eraseText();
  readData();
}

function processData() {
    readData();

  try {
    const mathMatrix = math.matrix(data);
  } catch (error) {
    console.error("Error processing matrix:", error);
  }

  dataStd = standardizeMatrix(data);
  const mathMatrixSTD = math.matrix(dataStd);

  calculateCovarianceMatrix();
  getEigenVectors();
  plot2D();
  plot3D();
}

function calculateCovarianceMatrix() {
  const n = data.length; // Number of points
  const m = data[0].length; // Dimension of each point
  /*
  const resultDim = document.getElementById("resultDim");
  const resultPoints = document.getElementById("resultPoints");

  try {
    const n = dataStd.length; // Number of points
    const m = dataStd[0].length; // Dimension of each point

    resultDim.innerHTML = `<strong>Number of Dimensions:</strong>\n${math.format(
      m,
      {
        precision: 3,
      }
    )}`;
    resultPoints.innerHTML = `<strong>Number of Points:</strong>\n${math.format(
      n,
      {
        precision: 3,
      }
    )}`;
*/
  const mean = new Array(m).fill(0);
  covarianceMatrix = Array.from({ length: m }, () => Array(m).fill(0));

  dataStd.forEach((row) => {
    row.forEach((value, i) => {
      mean[i] += value;
    });
  });
  mean.forEach((value, i) => {
    mean[i] /= n; // Calculate mean
  });

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      for (let k = 0; k < m; k++) {
        covarianceMatrix[j][k] +=
          (dataStd[i][j] - mean[j]) * (dataStd[i][k] - mean[k]);
      }
    }
  }

  for (let j = 0; j < m; j++) {
    for (let k = 0; k < m; k++) {
      covarianceMatrix[j][k] /= n - 1;
    }
  }
  /*
  } catch (error) {
    console.error("Error processing data:", error);
  }
  */
}

function processMatrix1() {
  try {
    const mathMatrix = math.matrix(data);
  } catch (error) {
    console.error("Error processing matrix:", error);
  }
  try {
    const mathMatrixSTD = math.matrix(dataStd);
  } catch (error) {
    console.error("Error processing matrix:", error);
  }
}
function getEigenVectors() {
  const result = math.eigs(covarianceMatrix);
  const E = result.values;
  const V = result.eigenvectors;
  const EText = `[${E.join(", ")}]`;

  var data = [
    {
      x: [...Array(E.length).keys()],
      y: E.reverse(),
      type: "bar",
    },
  ];
  var layout = {
    xaxis: {
      title: {
        text: "Eigenvalue Number",
      },
    },
    yaxis: {
      title: {
        text: "Eigenvalue Value",
      },
    },
  };
  Plotly.newPlot("plotE", data, layout);

  let eigenmatrix = [];
  V.forEach((ev, index) => {
    const Vunit = toUnitVector(ev.vector);
    eigenmatrix.push(Vunit);
  });
  const matrixT = math.transpose(eigenmatrix);

  const matrixRotated = math.multiply(dataStd, matrixT);
  const PC1Index = matrixRotated[0].length - 1;
  const PC2Index = matrixRotated[0].length - 2;
  const PC3Index = matrixRotated[0].length - 3;

  PC1 = matrixRotated.map((row) => row[PC1Index]);
  PC2 = matrixRotated.map((row) => row[PC2Index]);
  PC3 = matrixRotated.map((row) => row[PC3Index]);

  //console.log("PC1: ", PC1);
  //console.log("PC2: ", PC2);
  //console.log("PC3: ", PC3);
}

function standardizeMatrix(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;

  const means = Array(n).fill(0);
  const stdDevs = Array(n).fill(0);

  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < m; i++) {
      sum += matrix[i][j];
    }
    means[j] = sum / m;

    let varianceSum = 0;
    for (let i = 0; i < m; i++) {
      varianceSum += Math.pow(matrix[i][j] - means[j], 2);
    }
    stdDevs[j] = Math.sqrt(varianceSum / m);
  }

  const standardizedMatrix = matrix.map((row) => row.slice()); // Copia profunda de la matriz

  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) {
      if (stdDevs[j] !== 0) {
        standardizedMatrix[i][j] = (matrix[i][j] - means[j]) / stdDevs[j];
      } else {
        standardizedMatrix[i][j] = 0; // Si stdDev es 0, todos los valores son iguales, por lo que el resultado es 0
      }
    }
  }

  return standardizedMatrix;
}

function dotProduct(a, b) {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

function projectVector(a, b) {
  const dotProductAB = dotProduct(a, b);
  const dotProductBB = dotProduct(b, b);
  const scalar = dotProductAB / dotProductBB;

  return b.map((val) => val * scalar);
}

function vectorMagnitude(v) {
  return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
}

function toUnitVector(v) {
  const magnitude = vectorMagnitude(v);
  if (magnitude === 0)
    throw new Error("La magnitud del vector es cero, no se puede normalizar.");

  return v.map((val) => val / magnitude);
}
function eraseText() {
  document.getElementById("dataInput").value = "";
  document.getElementById("breastCancer").style.backgroundColor =
    "rgba(255, 255, 255, 0.6)";
  document.getElementById("MNIST").style.backgroundColor =
    "rgba(255, 255, 255, 0.6)";
  document.getElementById("ownDataset").style.backgroundColor =
    "rgba(255, 255, 255, 0.6)";
  document.getElementById("Col1").value = 0;
  document.getElementById("Col2").value = 1;
  document.getElementById("ColCat").value = -1;
  document.getElementById("skipRow").value = 0;

  resultDim.innerHTML = `<strong>Number of Dimensions:</strong> 0`;
  resultPoints.innerHTML = `<strong>Number of Points:</strong> 0`;
}
function splitByLabels(datosX, datosY, labels) {
  const result = {};
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];

    if (!result[label]) {
      result[label] = { x: [], y: [] };
    }

    result[label].x.push(datosX[i]);
    result[label].y.push(datosY[i]);
  }
  return result;
}

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
function plot2D() {
  const groupedData = splitByLabels(PC1, PC2, labels);
  const uniqueLabels = Object.keys(groupedData);
  uniqueLabels.forEach((label) => {
    colors[label] = getRandomColor();
  });

  const traces = uniqueLabels.map((label) => {
    return {
      x: groupedData[label].x, // Valores en el eje X
      y: groupedData[label].y, // Valores en el eje Y
      mode: "markers",
      name: `${label}`, // Nombre en la leyenda
      marker: {
        color: colors[label], // Color aleatorio para cada etiqueta
        size: 10,
        opacity: 0.5,
      },
      type: "scatter",
    };
  });

  const layout = {
    title: "Scatter Plot PC1 vs PC2",
    xaxis: { title: "PC1" },
    yaxis: { title: "PC2" },
    legend: { title: { text: "Labels" } },
  };
  Plotly.newPlot("plot2D", traces, layout);
}

function splitByLabels3(dataX, dataY, dataZ, labels) {
  const result = {};
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    if (!result[label]) {
      result[label] = { x: [], y: [], z: [] };
    }

    result[label].x.push(dataX[i]);
    result[label].y.push(dataY[i]);
    result[label].z.push(dataZ[i]);
  }
  return result;
}

function plot3D() {
  const groupedData = splitByLabels3(PC1, PC2, PC3, labels);
  const uniqueLabels = Object.keys(groupedData);

  const traces = uniqueLabels.map((label) => {
    return {
      x: groupedData[label].x, // Valores en el eje X
      y: groupedData[label].y, // Valores en el eje Y
      z: groupedData[label].z, // Valores en el eje Z
      mode: "markers",
      name: `${label}`, // Nombre en la leyenda
      marker: {
        color: colors[label], // Color aleatorio para cada etiqueta
        size: 5,
        opacity: 0.5,
      },
      type: "scatter3d",
    };
  });

  const layout = {
    title: "Scatter Plot PC1 vs PC2 vs PC3",
    scene: {
      xaxis: { title: "PC1" },
      yaxis: { title: "PC2" },
      zaxis: { title: "PC3" },
    },
    legend: { title: { text: "Labels" } },
  };

  Plotly.newPlot("plot3D", traces, layout);
}
