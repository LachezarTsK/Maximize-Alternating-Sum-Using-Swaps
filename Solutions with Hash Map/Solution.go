
package main
import "slices"

func maxAlternatingSum(input []int, swaps [][]int) int64 {
    unionFind := NewUnionFind(len(input))
    for _, swap := range swaps {
        unionFind.joinByRank(swap[0], swap[1])
    }

    var parentToConnectedComponents map[int]*ConnectedComponents = createMapParentToConnectedComponents(input, &unionFind)

    return calculateMaxAlternatingSum(parentToConnectedComponents)
}

func createMapParentToConnectedComponents(input []int, unionFind *UnionFind) map[int]*ConnectedComponents {
    parentToConnectedComponents := map[int]*ConnectedComponents{}
    for i := range input {
        parent := unionFind.findParent(i)

        if _, has := parentToConnectedComponents[parent]; !has {
            parentToConnectedComponents[parent] = &ConnectedComponents{}
        }

        if isEven(i) {
            parentToConnectedComponents[parent].numberOfEvenIndexes++
        }
        parentToConnectedComponents[parent].values = append(parentToConnectedComponents[parent].values, input[i])
    }

    return parentToConnectedComponents
}

func calculateMaxAlternatingSum(parentToConnectedComponents map[int]*ConnectedComponents) int64 {
    var maxAlternatingSum int64 = 0

    for _, current := range parentToConnectedComponents {

        slices.SortFunc(current.values, func(first int, second int) int { return second - first })

        for i := 0; i < current.numberOfEvenIndexes; i++ {
            maxAlternatingSum += int64(current.values[i])
        }
        for i := current.numberOfEvenIndexes; i < len(current.values); i++ {
            maxAlternatingSum -= int64(current.values[i])
        }
    }
    return maxAlternatingSum
}

func isEven(value int) bool {
    return value % 2 == 0
}

type ConnectedComponents struct {
    numberOfEvenIndexes int
    values              []int
}

type UnionFind struct {
    parent []int
    rank   []int
}

func NewUnionFind(numberOfElements int) UnionFind {
    unionFind := UnionFind{
        parent: make([]int, numberOfElements),
        rank:   make([]int, numberOfElements),
    }
    for i := range numberOfElements {
        unionFind.parent[i] = i
        unionFind.rank[i] = 1
    }
    return unionFind
}

func (this *UnionFind) findParent(index int) int {
    if this.parent[index] != index {
        this.parent[index] = this.findParent(this.parent[index])
    }
    return this.parent[index]
}

func (this *UnionFind) joinByRank(indexOne int, indexTwo int) {
    first := this.findParent(indexOne)
    second := this.findParent(indexTwo)
    if first == second {
        return
    }

    if this.rank[first] >= this.rank[second] {
        this.parent[second] = first
        this.rank[first] += this.rank[second]
    } else {
        this.parent[first] = second
        this.rank[second] += this.rank[first]
    }
}
