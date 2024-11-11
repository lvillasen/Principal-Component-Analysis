var input;
var data;
var labels;
var dataStd;
var covarianceMatrix;
var PC1;
var PC2;
var PC3;
const colors = {};
document.getElementById("skipCol").value = 2;
document.getElementById("skipRow").value = 2;
document.getElementById("categoryCol").value = 1;
//var toggle_info = document.getElementById("toggleInfo");
//toggle_info.addEventListener("click", info_out);

function processData() {
  input = document.getElementById("dataInput").value;
  const result = document.getElementById("result");
  //const resultData = document.getElementById("resultData");
  //const resultSTD = document.getElementById("resultSTD");
  const skipRow = parseInt(document.getElementById("skipRow").value);
  const skipCol = parseInt(document.getElementById("skipCol").value);
  const categoryCol = parseInt(document.getElementById("categoryCol").value);

  try {
    // Parse the input data
    //const data = input
    // .trim()
    //.split("\n")
    //.map((line) => line.split(",").map((num) => parseFloat(num.trim())));

    //const rows = input.trim().split("\n");
    const rows = input.trim().split("\n").slice(skipRow);

    // Map each row into an array of numbers
    data = rows.map((row) =>
      row
        .split(",")
        .slice(skipCol, -1)
        .map((num) => parseFloat(num.trim()))
    );
    labels = rows.map((row) =>
      //parseFloat(row.split(",").slice(-1)[0].trim())
      row.split(",").slice(categoryCol)[0].trim()
    );
    console.log("labels " + labels);
    if (
      !Array.isArray(data) ||
      !data.every((row) => Array.isArray(row) && row.length > 0)
    ) {
      throw new Error("Each row must contain numbers separated by commas.");
    }

    //////

    try {
      // Convert array to a math.js matrix for further operations
      const mathMatrix = math.matrix(data);

      // Display the matrix
      /*
      resultData.innerHTML = `<strong>Data Matrix:</strong>\n${math.format(
        mathMatrix,
        {
          precision: 3,
        }
      )}`;
      */
    } catch (error) {
      //resultData.innerHTML = "Error: " + error.message;
      console.error("Error processing matrix:", error);
    }

    ////

    dataStd = standardizeMatrix(data);
    //dataStd = data;
    const mathMatrixSTD = math.matrix(dataStd);

    // Display the matrix
    /*
    resultSTD.innerHTML = `<strong>Data Matrix:</strong>\n${math.format(
      mathMatrixSTD,
      {
        precision: 3,
      }
    )}`;
*/
    //dataStd = data;

    // Apply PCA using PCA-js
    //const vectors = PCA.getEigenVectors(dataStd);
    /*
    console.log(
      math.format(vectors, {
        precision: 3,
      })
    );
    
    console.log("vectors[0]", vectors[0][0]);
    
    const firstComponentPercentage = PCA.computePercentageExplained(
      vectors,
      vectors[0]
    );
    const topTwoComponentsPercentage = PCA.computePercentageExplained(
      vectors,
      vectors[0],
      vectors[1]
    );

    // Display results

    result.innerHTML = `
                    Eigen Vectors:\n${JSON.stringify(vectors, null, 2)}
                    \n\nPercentage of variance explained by the first component: ${firstComponentPercentage}
                    \nPercentage of variance explained by the first two components: ${topTwoComponentsPercentage}
                `;

    console.log("data:", data);
    console.log("Eigen Vectors:", vectors);
    console.log(
      "First Component Percentage Explained:",
      firstComponentPercentage
    );
    console.log(
      "Top Two Components Percentage Explained:",
      topTwoComponentsPercentage
    );
    */
  } catch (error) {
    //result.innerHTML = "Error: " + error.message;
    console.error("Error processing data:", error);
  }

  calculateCovarianceMatrix();
  //multiplyMatrices();
  //processMatrix1();
  getEigenVectors();
  plot2DN();
  plot3DN();
}

function calculateCovarianceMatrix() {
  //const input = document.getElementById("dataInput").value;
  const resultDiv = document.getElementById("resultCov");
  const resultDim = document.getElementById("resultDim");
  const resultPoints = document.getElementById("resultPoints");

  try {
    // Parse the input data

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

    const mean = new Array(m).fill(0);
    covarianceMatrix = Array.from({ length: m }, () => Array(m).fill(0));

    // Calculate the mean of each dimension
    dataStd.forEach((row) => {
      row.forEach((value, i) => {
        mean[i] += value;
      });
    });
    mean.forEach((value, i) => {
      mean[i] /= n; // Calculate mean
    });

    // Calculate covariance matrix
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        for (let k = 0; k < m; k++) {
          covarianceMatrix[j][k] +=
            (dataStd[i][j] - mean[j]) * (dataStd[i][k] - mean[k]);
        }
      }
    }

    // Normalize the covariance matrix
    for (let j = 0; j < m; j++) {
      for (let k = 0; k < m; k++) {
        covarianceMatrix[j][k] /= n - 1; // Bessel's correction
      }
    }

    // Display results
    /*
    resultDiv.innerHTML = `<strong>CovarianceMatrix:</strong>\n${math.format(
      covarianceMatrix,
      {
        precision: 3,
      }
    )}`;
  */
  } catch (error) {
    //resultDiv.innerHTML = "Error: " + error.message;
    console.error("Error processing data:", error);
  }
}
function multiplyMatrices() {
  console.log(math.ones(2, 3));
}

function processMatrix1() {
  //const resultDiv = document.getElementById("resultMatrix");
  //const resultSTD = document.getElementById("resultSTDMatrix");

  try {
    // Convert array to a math.js matrix for further operations
    const mathMatrix = math.matrix(data);

    // Display the matrix
    /*
    resultDiv.innerHTML = `<strong>Data Matrix:</strong>\n${math.format(
      mathMatrix,
      {
        precision: 3,
      }
    )}`;
    */
  } catch (error) {
    //resultDiv.innerHTML = "Error: " + error.message;
    console.error("Error processing matrix:", error);
  }
  try {
    // Convert array to a math.js matrix for further operations
    const mathMatrixSTD = math.matrix(dataStd);

    // Display the matrix
    /*
    resultSTD.innerHTML = `<strong>Data Matrix:</strong>\n${math.format(
      mathMatrixSTD,
      {
        precision: 3,
      }
    )}`;
    */
  } catch (error) {
    //resultSTD.innerHTML = "Error: " + error.message;
    console.error("Error processing matrix:", error);
  }
}
function getEigenVectors() {
  //const resultEigenVal = document.getElementById("resultEigenValues");
  //const resultEigenVal = document.getElementById("resultEigenValues");
  //const resultEigenMat = document.getElementById("resultEigenMatrix");
  //const resultRot = document.getElementById("resultRotated");

  const result = math.eigs(covarianceMatrix);
  const E = result.values;
  const V = result.eigenvectors;
  const EText = `[${E.join(", ")}]`;

  // Mostrar el vector en el elemento con id "vector-output"

  //resultRot.innerHTML = `<strong>Eigenvalues:</strong> ${EText}`;

  //console.log("Eigenvalues:", E);

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

  //console.log("V[0].vector", V[0].vector);
  let eigenmatrix = [];
  V.forEach((ev, index) => {
    const Vunit = toUnitVector(ev.vector);
    eigenmatrix.push(Vunit);
  });
  /*
  let latexMatrix = "\\[ \\begin{bmatrix} ";
  eigenmatrix.forEach((row) => {
    latexMatrix += row.join(" & ") + " \\\\ "; // Agregar cada fila
  });
  latexMatrix += " \\end{bmatrix} \\]";
  resultEigenMat.innerHTML = latexMatrix;
  */
  /*
  resultEigenMat.innerHTML = `<strong>Matrix of Eigenvectors:</strong>\n${math.format(
    eigenmatrix,
    {
      precision: 4,
    }
  )}`;
  */
  const matrixT = math.transpose(eigenmatrix);

  const matrixRotated = math.multiply(dataStd, matrixT);
  /*
  resultRot.innerHTML = `<br><strong>Rotated Data:</strong>\n${math.format(
    matrixRotated,
    {
      precision: 4,
    }
  )}`;
  */

  //V.forEach((ev, index) => {
  //  console.log(`<strong>Eigenvaectors;</strong> ${index + 1}:`, ev.vector);
  //});

  const PC1Index = matrixRotated[0].length - 1;
  const PC2Index = matrixRotated[0].length - 2;
  const PC3Index = matrixRotated[0].length - 3;

  // Extract the last column
  PC1 = matrixRotated.map((row) => row[PC1Index]);
  PC2 = matrixRotated.map((row) => row[PC2Index]);
  PC3 = matrixRotated.map((row) => row[PC3Index]);

  console.log("PC1: ", PC1);
  console.log("PC2: ", PC2);
  console.log("PC3: ", PC3);
  /*
  resultRot.innerHTML += `<br><strong>PC1:</strong>\n${math.format(PC1, {
    precision: 4,
  })}`;
  resultRot.innerHTML += `<br><strong>PC2:</strong>\n${math.format(PC2, {
    precision: 4,
  })}`;
  resultRot.innerHTML += `<br><strong>PC3:</strong>\n${math.format(PC3, {
    precision: 4,
  })}`;
  resultRot.innerHTML += `<br><strong>Labels:</strong>\n${math.format(labels, {
    precision: 1,
  })}`;
  infoFirst_out();
  */
}
function plot2D() {
  var trace2D = {
    x: PC1,
    y: PC2,
    mode: "markers+text",
    marker: {
      color: labels.map((label) => (label === "M" ? "red" : "green")),
      size: 10,
      symbol: "circle",
      opacity: 0.5,
    },
    type: "scatter",
    text: labels.map((label) => (label === "M" ? "M" : "B")),
  };
  var layout2D = {
    //scattermode: 'group',
    title: "PCA in 2D",
    xaxis: { title: "PC1", scaleanchor: "y", scaleratio: 1 },
    yaxis: { title: "PC2", scaleanchor: "x", scaleratio: 1 },
  };

  Plotly.newPlot("plot2D", [trace2D], layout2D);
}
function plot3D() {
  var trace3D = {
    x: PC1,
    y: PC2,
    z: PC3,
    mode: "markers",
    marker: {
      color: labels.map((label) => (label === "M" ? "red" : "green")),
      //color: "rgb(0,0,200)",
      size: 5,
      symbol: "circle",
      opacity: 0.5,
    },
    type: "scatter3d",
  };
  var layout3D = {
    //scattermode: 'group',
    scene: {
      xaxis: { title: "PC1" },
      yaxis: { title: "PC2" },
      zaxis: { title: "PC3" },
      // aspectratio=dict(x=1, y=1, z=1),
    },
    title: "PCA in 3D",
    //xaxis: { title: "PC1" },
    //yaxis: { title: "PC2" },
    //zaxis: { title: "PC3" },
  };

  Plotly.newPlot("plot3D", [trace3D], layout3D);
}

function standardizeMatrix(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;

  // Calcular media y desviación estándar para cada columna
  const means = Array(n).fill(0);
  const stdDevs = Array(n).fill(0);

  for (let j = 0; j < n; j++) {
    // Calcular media de la columna j
    let sum = 0;
    for (let i = 0; i < m; i++) {
      sum += matrix[i][j];
    }
    means[j] = sum / m;

    // Calcular desviación estándar de la columna j
    let varianceSum = 0;
    for (let i = 0; i < m; i++) {
      varianceSum += Math.pow(matrix[i][j] - means[j], 2);
    }
    stdDevs[j] = Math.sqrt(varianceSum / m);
  }

  // Crear la matriz estandarizada
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
}
/*
function info_out() {
  var infoOut = document.getElementById("infoOut");
  if (infoOut.style.display === "none") {
    infoOut.style.display = "block";
  } else {
    infoOut.style.display = "none";
  }
}
function infoFirst_out() {
  var infoOut = document.getElementById("infoOut");
  infoOut.style.display = "none";
}
*/
function splitByLabels(datosX, datosY, labels) {
  const result = {};
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];

    // Si no existe un arreglo para esta etiqueta, se inicializa
    if (!result[label]) {
      result[label] = { x: [], y: [] };
    }

    // Agregamos los valores correspondientes de datosX y datosY al grupo de la etiqueta
    result[label].x.push(datosX[i]);
    result[label].y.push(datosY[i]);
  }
  return result;
}

function getRandomColor() {
  // Genera un color RGB aleatorio en formato hexadecimal
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
function plot2DN() {
  //const datosX = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  //const datosY = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  //const labels = ['A', 'B', 'A', 'C', 'B', 'C', 'A', 'B', 'D'];

  // Obtenemos los datos separados por etiquetas
  const groupedData = splitByLabels(PC1, PC2, labels);
  const uniqueLabels = Object.keys(groupedData);
  //const colors = {};
  uniqueLabels.forEach((label) => {
    colors[label] = getRandomColor();
  });

  // Crear el array de trazas para el gráfico de dispersión
  const traces = uniqueLabels.map((label) => {
    return {
      x: groupedData[label].x, // Valores en el eje X
      y: groupedData[label].y, // Valores en el eje Y
      mode: "markers",
      name: `${label}`, // Nombre en la leyenda
      marker: {
        color: colors[label], // Color aleatorio para cada etiqueta
        size: 10,
      },
      type: "scatter",
    };
  });

  // Configuración del layout
  const layout = {
    title: "Scatter Plot PC1 vs PC2",
    xaxis: { title: "PC1" },
    yaxis: { title: "PC2" },
    legend: { title: { text: "Labels" } },
  };

  // Graficar usando Plotly
  Plotly.newPlot("plot2D", traces, layout);
}

function splitByLabels3(dataX, dataY, dataZ, labels) {
  const result = {};
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];

    // Si no existe un arreglo para esta etiqueta, se inicializa
    if (!result[label]) {
      result[label] = { x: [], y: [], z: [] };
    }

    // Agregar los valores correspondientes de dataX, dataY y dataZ al grupo de la etiqueta
    result[label].x.push(dataX[i]);
    result[label].y.push(dataY[i]);
    result[label].z.push(dataZ[i]);
  }
  return result;
}

function getRandomColor() {
  // Genera un color RGB aleatorio en formato hexadecimal
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function plot3DN() {
  // Obtenemos los datos separados por etiquetas
  const groupedData = splitByLabels3(PC1, PC2, PC3, labels);
  const uniqueLabels = Object.keys(groupedData);

  // Crear el array de trazas para el gráfico de dispersión 3D
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
      },
      type: "scatter3d",
    };
  });

  // Configuración del layout
  const layout = {
    title: "Scatter Plot PC1 vs PC2 vs PC3",
    scene: {
      xaxis: { title: "PC1" },
      yaxis: { title: "PC2" },
      zaxis: { title: "PC3" },
    },
    legend: { title: { text: "Labels" } },
  };

  // Graficar usando Plotly
  Plotly.newPlot("plot3D", traces, layout);
}
