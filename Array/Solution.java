
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Solution {

    private class ConnectedComponents {

        int numberOfEvenIndexes;
        List<Integer> values = new ArrayList<>();
    }

    public long maxAlternatingSum(int[] input, int[][] swaps) {
        UnionFind unionFind = new UnionFind(input.length);
        for (int[] swap : swaps) {
            unionFind.joinByRank(swap[0], swap[1]);
        }

        ConnectedComponents[] parentToConnectedComponents
                = createMapParentToConnectedComponents(input, unionFind);

        return calculateMaxAlternatingSum(parentToConnectedComponents);
    }

    private ConnectedComponents[] createMapParentToConnectedComponents(int[] input, UnionFind unionFind) {
        ConnectedComponents[] parentToConnectedComponents = new ConnectedComponents[input.length];
        for (int i = 0; i < input.length; ++i) {
            parentToConnectedComponents[i] = new ConnectedComponents();
        }

        for (int i = 0; i < input.length; ++i) {
            int parent = unionFind.findParent(i);

            if (isEven(i)) {
                ++parentToConnectedComponents[parent].numberOfEvenIndexes;
            }
            parentToConnectedComponents[parent].values.add(input[i]);
        }

        return parentToConnectedComponents;
    }

    private long calculateMaxAlternatingSum(ConnectedComponents[] parentToConnectedComponents) {
        long maxAlternatingSum = 0;
        for (var current : parentToConnectedComponents) {
            if (current.values.isEmpty()) {
                continue;
            }
            Collections.sort(current.values, (x, y) -> y - x);
            for (int i = 0; i < current.numberOfEvenIndexes; ++i) {
                maxAlternatingSum += current.values.get(i);
            }
            for (int i = current.numberOfEvenIndexes; i < current.values.size(); ++i) {
                maxAlternatingSum -= current.values.get(i);
            }
        }
        return maxAlternatingSum;
    }

    private boolean isEven(int value) {
        return value % 2 == 0;
    }
}

class UnionFind {

    int[] parent;
    int[] rank;

    UnionFind(int numberOfElements) {
        parent = new int[numberOfElements];
        rank = new int[numberOfElements];
        for (int i = 0; i < numberOfElements; ++i) {
            parent[i] = i;
            rank[i] = 1;
        }
    }

    int findParent(int index) {
        if (parent[index] != index) {
            parent[index] = findParent(parent[index]);
        }
        return parent[index];
    }

    void joinByRank(int indexOne, int indexTwo) {
        int first = findParent(indexOne);
        int second = findParent(indexTwo);
        if (first == second) {
            return;
        }

        if (rank[first] >= rank[second]) {
            parent[second] = first;
            rank[first] += rank[second];
        } else {
            parent[first] = second;
            rank[second] += rank[first];
        }
    }
}
