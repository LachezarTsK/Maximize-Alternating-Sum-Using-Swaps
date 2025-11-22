
function maxAlternatingSum(input: number[], swaps: number[][]): number {
    const unionFind = new UnionFind(input.length);
    for (let swap of swaps) {
        unionFind.joinByRank(swap[0], swap[1]);
    }

    const parentToConnectedComponents: ConnectedComponents[]
        = createMapParentToConnectedComponents(input, unionFind);

    return calculateMaxAlternatingSum(parentToConnectedComponents);
};

function createMapParentToConnectedComponents(input: number[], unionFind: UnionFind): ConnectedComponents[] {
    const parentToConnectedComponents = new Array(input.length);
    for (let i = 0; i < input.length; ++i) {
        parentToConnectedComponents[i] = new ConnectedComponents();
    }

    for (let i = 0; i < input.length; ++i) {
        const parent = unionFind.findParent(i);
        if (isEven(i)) {
            ++parentToConnectedComponents[parent].numberOfEvenIndexes;
        }
        parentToConnectedComponents[parent].values.push(input[i]);
    }

    return parentToConnectedComponents;
}

function calculateMaxAlternatingSum(parentToConnectedComponents: ConnectedComponents[]): number {
    let maxAlternatingSum = 0;
    for (let current of parentToConnectedComponents) {
        if (current.values.length === 0) {
            continue;
        }
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

function isEven(value: number): boolean {
    return value % 2 === 0;
}

class ConnectedComponents {

    numberOfEvenIndexes = 0;
    values = new Array();
}

class UnionFind {

    parent: number[];
    rank: number[];

    constructor(numberOfElements: number) {
        this.parent = new Array(numberOfElements);
        this.rank = new Array(numberOfElements);
        for (let i = 0; i < numberOfElements; ++i) {
            this.parent[i] = i;
            this.rank[i] = 1;
        }
    }

    findParent(index: number): number {
        if (this.parent[index] !== index) {
            this.parent[index] = this.findParent(this.parent[index]);
        }
        return this.parent[index];
    }

    joinByRank(indexOne: number, indexTwo: number): void {
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
