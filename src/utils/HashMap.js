export class CustomHashMap {
  constructor(bucketCount = 12) {
    this.bucketCount = bucketCount;
    this.buckets = Array.from({ length: bucketCount }, () => []);
  }

  // DJB2 hash algorithm
  hash(key) {
    let hash = 5381;
    const steps = [];
    
    for (let i = 0; i < key.length; i++) {
      const charCode = key.charCodeAt(i);
      const prevHash = hash;
      hash = ((hash << 5) + hash) + charCode; // hash * 33 + charCode
      hash = hash & hash; // Convert to 32bit integer
      
      // Let's record only the first 5 and last 2 characters to avoid huge arrays
      if (i < 5 || i >= key.length - 2) {
        steps.push(`char '${key[i]}' (code: ${charCode}): (${prevHash} * 33) + ${charCode} = ${hash}`);
      } else if (i === 5) {
        steps.push('... [hashing intermediate characters] ...');
      }
    }

    const index = Math.abs(hash) % this.bucketCount;
    return {
      hashValue: Math.abs(hash),
      index,
      steps
    };
  }

  set(key, value) {
    const { index } = this.hash(key);
    const bucket = this.buckets[index];
    
    // Check if key already exists, overwrite
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === key) {
        bucket[i].value = value;
        return;
      }
    }
    
    // Push new key-value pair
    bucket.push({ key, value });
  }

  get(key) {
    const { hashValue, index, steps } = this.hash(key);
    const bucket = this.buckets[index];
    let comparisons = 0;
    let foundValue = null;
    let collisionOccurred = bucket.length > 1;

    for (let i = 0; i < bucket.length; i++) {
      comparisons++;
      if (bucket[i].key === key) {
        foundValue = bucket[i].value;
        break;
      }
    }

    return {
      value: foundValue,
      hashValue,
      bucketIndex: index,
      bucketContents: bucket.map(item => item.key),
      hashingSteps: steps,
      comparisons,
      collisionOccurred,
      complexity: "O(1) average, O(k) bucket search"
    };
  }

  delete(key) {
    const { index } = this.hash(key);
    const bucket = this.buckets[index];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === key) {
        bucket.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  getBucketsState() {
    return this.buckets.map((bucket, idx) => ({
      index: idx,
      count: bucket.length,
      keys: bucket.map(item => item.key)
    }));
  }
}
