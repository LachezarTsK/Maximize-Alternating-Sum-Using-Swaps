
class Solution {

    private class ConnectedComponents() {
        var numberOfEvenIndexes = 0
        val values = mutableListOf<Int>()
    }

    fun maxAlternatingSum(input: IntArray, swaps: Array<IntArray>): Long {
        val unionFind = UnionFind(input.size)
        for (swap in swaps) {
            unionFind.joinByRank(swap[0], swap[1])
        }

        val parentToConnectedComponents: Array<ConnectedComponents> =
            createMapParentToConnectedComponents(input, unionFind)

        return calculateMaxAlternatingSum(parentToConnectedComponents)
    }

    private fun createMapParentToConnectedComponents(
        input: IntArray,
        unionFind: UnionFind
    ): Array<ConnectedComponents> {
        val parentToConnectedComponents = Array<ConnectedComponents>(input.size) { ConnectedComponents() }
        for (i in input.indices) {
            val parent = unionFind.findParent(i)
            if (isEven(i)) {
                ++parentToConnectedComponents[parent].numberOfEvenIndexes
            }
            parentToConnectedComponents[parent].values.add(input[i])
        }

        return parentToConnectedComponents
    }

    private fun calculateMaxAlternatingSum(parentToConnectedComponents: Array<ConnectedComponents>): Long {
        var maxAlternatingSum: Long = 0

        for (current in parentToConnectedComponents) {
            if (current.values.isEmpty()) {
                continue
            }
            current.values.sortWith() { x, y -> y - x }
            for (i in 0..<current.numberOfEvenIndexes) {
                maxAlternatingSum += current.values[i]
            }
            for (i in current.numberOfEvenIndexes..<current.values.size) {
                maxAlternatingSum -= current.values[i]
            }
        }
        return maxAlternatingSum
    }

    private fun isEven(value: Int): Boolean {
        return value % 2 == 0
    }
}

class UnionFind(private val numberOfElements: Int) {

    private var parent = IntArray(numberOfElements) { i -> i }
    private var rank = IntArray(numberOfElements) { 1 }

    fun findParent(index: Int): Int {
        if (parent[index] != index) {
            parent[index] = findParent(parent[index])
        }
        return parent[index]
    }

    fun joinByRank(indexOne: Int, indexTwo: Int) {
        val first = findParent(indexOne)
        val second = findParent(indexTwo)
        if (first == second) {
            return
        }

        if (rank[first] >= rank[second]) {
            parent[second] = first
            rank[first] += rank[second]
        } else {
            parent[first] = second
            rank[second] += rank[first]
        }
    }
}
