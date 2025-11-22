
/**
 * @param {number[]} input
 * @param {number[][]} swaps
 * @return {number}
 */
var maxAlternatingSum = function (input, swaps) {
    const unionFind = new UnionFind(input.length);
    for (let swap of swaps) {
        unionFind.joinByRank(swap[0], swap[1]);
    }

    const parentToConnectedComponents
            = createMapParentToConnectedComponents(input, unionFind);

    return calculateMaxAlternatingSum(parentToConnectedComponents);
};

/**
 * @param {number[]} input
 * @param {UnionFind} unionFind
 * @return {Map<number,ConnectedComponents> }
 */
function createMapParentToConnectedComponents(input, unionFind) {
    const parentToConnectedComponents = new Map();
    for (let i = 0; i < input.length; ++i) {
        const parent = unionFind.findParent(i);
        if (!parentToConnectedComponents.has(parent)) {
            parentToConnectedComponents.set(parent, new ConnectedComponents());
        }
        if (isEven(i)) {
            ++parentToConnectedComponents.get(parent).numberOfEvenIndexes;
        }
        parentToConnectedComponents.get(parent).values.push(input[i]);
    }

    return parentToConnectedComponents;
}

/**
 * @param {Map<number,ConnectedComponents>} parentToConnectedComponents
 * @return {number}
 */
function calculateMaxAlternatingSum(parentToConnectedComponents) {
    let maxAlternatingSum = 0;
    for (let current of parentToConnectedComponents.values()) {
        current.values.sort((x, y) => y - x);
        for (let i = 0; i < current.numberOfEvenIndexes; ++i) {
            maxAlternatingSum += current.values[i];
        }
        for (let i = current.numberOfEvenIndexes; i < current.values.length; ++i) {
            maxAlternatingSum -= current.values[i];
        }
    }
    return maxAlternatingSum;
}

/**
 * @param {number} value
 * @return {boolean}
 */
function isEven(value) {
    return value % 2 === 0;
}

class ConnectedComponents {

    numberOfEvenIndexes = 0;
    values = new Array();
}

class UnionFind {

    /**
     * @param {number} numberOfElements
     */
    constructor(numberOfElements) {
        this.parent = new Array(numberOfElements);
        this.rank = new Array(numberOfElements);
        for (let i = 0; i < numberOfElements; ++i) {
            this.parent[i] = i;
            this.rank[i] = 1;
        }
    }

    /**
     * @param {number} index
     * @return {number}
     */
    findParent(index) {
        if (this.parent[index] !== index) {
            this.parent[index] = this.findParent(this.parent[index]);
        }
        return this.parent[index];
    }

    /**
     * @param {number} indexOne
     * @param {number} indexTwo
     * @return {void}
     */
    joinByRank(indexOne, indexTwo) {
        const first = this.findParent(indexOne);
        const second = this.findParent(indexTwo);
        if (first === second) {
            return;
        }

        if (this.rank[first] >= this.rank[second]) {
            this.parent[second] = first;
            this.rank[first] += this.rank[second];
        } else {
            this.parent[first] = second;
            this.rank[second] += this.rank[first];
        }
    }
}
