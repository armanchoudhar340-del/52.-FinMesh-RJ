// Quick Sort with Step Tracing
export function runQuickSort(array, key, order = 'desc') {
  let steps = []; // Snapshots of array state and activities
  let comparisons = 0;
  let swaps = 0;
  let arr = JSON.parse(JSON.stringify(array)); // Deep clone

  function swap(i, j) {
    if (i === j) return;
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    swaps++;
    steps.push({
      arr: JSON.parse(JSON.stringify(arr)),
      compare: [i, j],
      action: 'swap',
      pivot: -1
    });
  }

  function quickSortHelper(low, high) {
    if (low < high) {
      let pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    }
  }

  function partition(low, high) {
    let pivot = arr[high];
    steps.push({
      arr: JSON.parse(JSON.stringify(arr)),
      compare: [],
      action: 'select-pivot',
      pivot: high
    });
    
    let i = low - 1;
    for (let j = low; j < high; j++) {
      comparisons++;
      steps.push({
        arr: JSON.parse(JSON.stringify(arr)),
        compare: [j, high],
        action: 'compare',
        pivot: high
      });

      const cmpVal = order === 'desc' 
        ? arr[j][key] > pivot[key] 
        : arr[j][key] < pivot[key];

      if (cmpVal) {
        i++;
        swap(i, j);
      }
    }
    swap(i + 1, high);
    return i + 1;
  }

  quickSortHelper(0, arr.length - 1);
  // Final step to represent completion
  steps.push({
    arr: JSON.parse(JSON.stringify(arr)),
    compare: [],
    action: 'sorted',
    pivot: -1
  });

  return { sorted: arr, steps, comparisons, swaps };
}

// Merge Sort with Step Tracing
export function runMergeSort(array, key, order = 'desc') {
  let steps = [];
  let comparisons = 0;
  let swaps = 0; // Item movements
  let arr = JSON.parse(JSON.stringify(array));

  function mergeSortHelper(low, high) {
    if (low < high) {
      let mid = Math.floor((low + high) / 2);
      mergeSortHelper(low, mid);
      mergeSortHelper(mid + 1, high);
      merge(low, mid, high);
    }
  }

  function merge(low, mid, high) {
    let left = arr.slice(low, mid + 1);
    let right = arr.slice(mid + 1, high + 1);
    let i = 0, j = 0, k = low;

    steps.push({
      arr: JSON.parse(JSON.stringify(arr)),
      compare: [],
      action: 'divide',
      range: [low, mid, high]
    });

    while (i < left.length && j < right.length) {
      comparisons++;
      steps.push({
        arr: JSON.parse(JSON.stringify(arr)),
        compare: [low + i, mid + 1 + j],
        action: 'compare',
        range: [low, mid, high]
      });

      const cmpVal = order === 'desc'
        ? left[i][key] > right[j][key]
        : left[i][key] < right[j][key];

      if (cmpVal) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      swaps++;
      k++;
      steps.push({
        arr: JSON.parse(JSON.stringify(arr)),
        compare: [k - 1],
        action: 'write',
        range: [low, mid, high]
      });
    }

    while (i < left.length) {
      arr[k] = left[i];
      i++;
      k++;
      swaps++;
      steps.push({
        arr: JSON.parse(JSON.stringify(arr)),
        compare: [k - 1],
        action: 'write',
        range: [low, mid, high]
      });
    }

    while (j < right.length) {
      arr[k] = right[j];
      j++;
      k++;
      swaps++;
      steps.push({
        arr: JSON.parse(JSON.stringify(arr)),
        compare: [k - 1],
        action: 'write',
        range: [low, mid, high]
      });
    }
  }

  mergeSortHelper(0, arr.length - 1);
  steps.push({
    arr: JSON.parse(JSON.stringify(arr)),
    compare: [],
    action: 'sorted',
    range: [0, 0, arr.length - 1]
  });

  return { sorted: arr, steps, comparisons, swaps };
}
