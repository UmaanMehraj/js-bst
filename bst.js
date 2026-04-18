class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    const sortedArray = [...new Set(array)].sort((a, b) => a - b);
    return this.buildTreeRecursive(sortedArray, 0, sortedArray.length - 1);
  }

  buildTreeRecursive(array, start, end) {
    if (start > end) {
      return null;
    }

    const mid = Math.floor((start + end) / 2);
    const node = new Node(array[mid]);

    node.left = this.buildTreeRecursive(array, start, mid - 1);
    node.right = this.buildTreeRecursive(array, mid + 1, end);

    return node;
  }

  includes(value) {
    return this.includesRecursive(this.root, value);
  }

  includesRecursive(node, value) {
    if (node === null) {
      return false;
    }

    if (value === node.data) {
      return true;
    } else if (value < node.data) {
      return this.includesRecursive(node.left, value);
    } else {
      return this.includesRecursive(node.right, value);
    }
  }

  insert(value) {
    if (this.root === null) {
      this.root = new Node(value);
    } else {
      this.insertRecursive(this.root, value);
    }
  }

  insertRecursive(node, value) {
    if (value === node.data) {
      return;
    }

    if (value < node.data) {
      if (node.left === null) {
        node.left = new Node(value);
      } else {
        this.insertRecursive(node.left, value);
      }
    } else {
      if (node.right === null) {
        node.right = new Node(value);
      } else {
        this.insertRecursive(node.right, value);
      }
    }
  }

  deleteItem(value) {
    this.root = this.deleteRecursive(this.root, value);
  }

  deleteRecursive(node, value) {
    if (node === null) {
      return null;
    }

    if (value < node.data) {
      node.left = this.deleteRecursive(node.left, value);
    } else if (value > node.data) {
      node.right = this.deleteRecursive(node.right, value);
    } else {
      if (node.left === null && node.right === null) {
        return null;
      }

      if (node.left === null) {
        return node.right;
      }
      if (node.right === null) {
        return node.left;
      }

      const minRight = this.findMin(node.right);
      node.data = minRight.data;
      node.right = this.deleteRecursive(node.right, minRight.data);
    }

    return node;
  }

  findMin(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  levelOrderForEach(callback) {
    if (typeof callback !== 'function') {
      throw new Error('A callback function is required');
    }

    if (this.root === null) {
      return;
    }

    const queue = [this.root];

    while (queue.length > 0) {
      const node = queue.shift();
      callback(node.data);

      if (node.left !== null) {
        queue.push(node.left);
      }
      if (node.right !== null) {
        queue.push(node.right);
      }
    }
  }

  inOrderForEach(callback) {
    if (typeof callback !== 'function') {
      throw new Error('A callback function is required');
    }

    this.inOrderRecursive(this.root, callback);
  }

  inOrderRecursive(node, callback) {
    if (node === null) {
      return;
    }

    this.inOrderRecursive(node.left, callback);
    callback(node.data);
    this.inOrderRecursive(node.right, callback);
  }

  preOrderForEach(callback) {
    if (typeof callback !== 'function') {
      throw new Error('A callback function is required');
    }

    this.preOrderRecursive(this.root, callback);
  }

  preOrderRecursive(node, callback) {
    if (node === null) {
      return;
    }

    callback(node.data);
    this.preOrderRecursive(node.left, callback);
    this.preOrderRecursive(node.right, callback);
  }

  postOrderForEach(callback) {
    if (typeof callback !== 'function') {
      throw new Error('A callback function is required');
    }

    this.postOrderRecursive(this.root, callback);
  }

  postOrderRecursive(node, callback) {
    if (node === null) {
      return;
    }

    this.postOrderRecursive(node.left, callback);
    this.postOrderRecursive(node.right, callback);
    callback(node.data);
  }

  height(value) {
    const node = this.findNode(this.root, value);
    if (node === null) {
      return undefined;
    }
    return this.getHeightRecursive(node);
  }

  getHeightRecursive(node) {
    if (node === null) {
      return -1;
    }

    const leftHeight = this.getHeightRecursive(node.left);
    const rightHeight = this.getHeightRecursive(node.right);

    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(value) {
    return this.getDepthRecursive(this.root, value, 0);
  }

  getDepthRecursive(node, value, currentDepth) {
    if (node === null) {
      return undefined;
    }

    if (value === node.data) {
      return currentDepth;
    } else if (value < node.data) {
      return this.getDepthRecursive(node.left, value, currentDepth + 1);
    } else {
      return this.getDepthRecursive(node.right, value, currentDepth + 1);
    }
  }

  findNode(node, value) {
    if (node === null) {
      return null;
    }

    if (value === node.data) {
      return node;
    } else if (value < node.data) {
      return this.findNode(node.left, value);
    } else {
      return this.findNode(node.right, value);
    }
  }

  isBalanced() {
    return this.isBalancedRecursive(this.root).balanced;
  }

  isBalancedRecursive(node) {
    if (node === null) {
      return { balanced: true, height: -1 };
    }

    const leftResult = this.isBalancedRecursive(node.left);
    if (!leftResult.balanced) {
      return { balanced: false, height: 0 };
    }

    const rightResult = this.isBalancedRecursive(node.right);
    if (!rightResult.balanced) {
      return { balanced: false, height: 0 };
    }

    const heightDifference = Math.abs(leftResult.height - rightResult.height);
    const balanced = heightDifference <= 1;
    const height = Math.max(leftResult.height, rightResult.height) + 1;

    return { balanced, height };
  }

  rebalance() {
    const values = [];
    this.inOrderForEach((value) => {
      values.push(value);
    });
    this.root = this.buildTree(values);
  }
}

const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null || node === undefined) {
    return;
  }

  prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
};

const generateRandomArray = (size = 15, maxValue = 100) => {
  const array = [];
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * maxValue));
  }
  return array;
};

console.log('=== Binary Search Tree Driver Script ===\n');

console.log('Step 1: Creating a balanced BST from random numbers (< 100)...');
const randomArray = generateRandomArray(15, 100);
console.log('Input array:', randomArray);
const tree = new Tree(randomArray);
console.log('\nTree structure:');
prettyPrint(tree.root);

console.log('\nStep 2: Checking if tree is balanced...');
console.log('Is balanced:', tree.isBalanced());

console.log('\nStep 3: Printing elements in different traversal orders...');

console.log('\nLevel-order (breadth-first):');
const levelOrder = [];
tree.levelOrderForEach((value) => levelOrder.push(value));
console.log(levelOrder.join(', '));

console.log('\nPre-order traversal:');
const preOrder = [];
tree.preOrderForEach((value) => preOrder.push(value));
console.log(preOrder.join(', '));

console.log('\nPost-order traversal:');
const postOrder = [];
tree.postOrderForEach((value) => postOrder.push(value));
console.log(postOrder.join(', '));

console.log('\nIn-order traversal:');
const inOrder = [];
tree.inOrderForEach((value) => inOrder.push(value));
console.log(inOrder.join(', '));

console.log('\n\nStep 4: Unbalancing the tree by adding numbers > 100...');
const numbersToAdd = [101, 102, 103, 104, 105];
console.log('Adding:', numbersToAdd.join(', '));
numbersToAdd.forEach((num) => tree.insert(num));
console.log('\nUnbalanced tree structure:');
prettyPrint(tree.root);

console.log('\nStep 5: Checking if tree is unbalanced...');
console.log('Is balanced:', tree.isBalanced());

console.log('\nStep 6: Rebalancing the tree...');
tree.rebalance();
console.log('\nRebalanced tree structure:');
prettyPrint(tree.root);

console.log('\nStep 7: Checking if tree is balanced...');
console.log('Is balanced:', tree.isBalanced());

console.log('\nFinal traversals after rebalancing...');

console.log('\nLevel-order traversal:');
const finalLevelOrder = [];
tree.levelOrderForEach((value) => finalLevelOrder.push(value));
console.log(finalLevelOrder.join(', '));

console.log('\nPre-order traversal:');
const finalPreOrder = [];
tree.preOrderForEach((value) => finalPreOrder.push(value));
console.log(finalPreOrder.join(', '));

console.log('\nPost-order traversal:');
const finalPostOrder = [];
tree.postOrderForEach((value) => finalPostOrder.push(value));
console.log(finalPostOrder.join(', '));

console.log('\nIn-order traversal:');
const finalInOrder = [];
tree.inOrderForEach((value) => finalInOrder.push(value));
console.log(finalInOrder.join(', '));

console.log('\n\n=== Additional Feature Demonstrations ===\n');

console.log('Testing includes() function:');
const testValue = inOrder[Math.floor(inOrder.length / 2)];
console.log(`Does tree include ${testValue}? ${tree.includes(testValue)}`);
console.log(`Does tree include 999? ${tree.includes(999)}`);

console.log('\nTesting height() and depth() functions:');
console.log(`Height of root: ${tree.height(tree.root.data)}`);
console.log(`Depth of root: ${tree.depth(tree.root.data)}`);
const someValue = inOrder[0];
console.log(`Height of ${someValue}: ${tree.height(someValue)}`);
console.log(`Depth of ${someValue}: ${tree.depth(someValue)}`);

console.log('\nTesting insert() function:');
const newValue = 50;
console.log(`Inserting ${newValue}...`);
tree.insert(newValue);
const insertedCheck = tree.includes(newValue);
console.log(`Tree now includes ${newValue}: ${insertedCheck}`);

console.log('\nTesting deleteItem() function:');
const valueToDelete = inOrder[0];
console.log(`Deleting ${valueToDelete}...`);
tree.deleteItem(valueToDelete);
const deletedCheck = tree.includes(valueToDelete);
console.log(`Tree still includes ${valueToDelete}: ${deletedCheck}`);

console.log('\n=== End of Driver Script ===');
