
using System;
using System.Collections.Generic;

public class Solution
{
    private class ConnectedComponents
    {
        public int numberOfEvenIndexes;
        public List<int> values = [];
    }

    public long MaxAlternatingSum(int[] input, int[][] swaps)
    {
        UnionFind unionFind = new UnionFind(input.Length);
        foreach (int[] swap in swaps)
        {
            unionFind.joinByRank(swap[0], swap[1]);
        }

        Dictionary<int, ConnectedComponents> parentToConnectedComponents
                 = createMapParentToConnectedComponents(input, unionFind);

        return calculateMaxAlternatingSum(parentToConnectedComponents);
    }

    private Dictionary<int, ConnectedComponents> createMapParentToConnectedComponents(int[] input, UnionFind unionFind)
    {
        Dictionary<int, ConnectedComponents> parentToConnectedComponents = [];
        for (int i = 0; i < input.Length; ++i)
        {
            int parent = unionFind.findParent(i);
            parentToConnectedComponents.TryAdd(parent, new ConnectedComponents());
            if (isEven(i))
            {
                ++parentToConnectedComponents[parent].numberOfEvenIndexes;
            }
            parentToConnectedComponents[parent].values.Add(input[i]);
        }

        return parentToConnectedComponents;
    }

    private long calculateMaxAlternatingSum(Dictionary<int, ConnectedComponents> parentToConnectedComponents)
    {
        long maxAlternatingSum = 0;
        foreach (var current in parentToConnectedComponents.Values)
        {
            current.values.Sort((x, y) => y - x);
            for (int i = 0; i < current.numberOfEvenIndexes; ++i)
            {
                maxAlternatingSum += current.values[i];
            }
            for (int i = current.numberOfEvenIndexes; i < current.values.Count; ++i)
            {
                maxAlternatingSum -= current.values[i];
            }
        }
        return maxAlternatingSum;
    }

    private bool isEven(int value)
    {
        return value % 2 == 0;
    }
}

class UnionFind
{
    int[] parent;
    int[] rank;

    public UnionFind(int numberOfElements)
    {
        parent = new int[numberOfElements];
        rank = new int[numberOfElements];
        for (int i = 0; i < numberOfElements; ++i)
        {
            parent[i] = i;
            rank[i] = 1;
        }
    }

    public int findParent(int index)
    {
        if (parent[index] != index)
        {
            parent[index] = findParent(parent[index]);
        }
        return parent[index];
    }

    public void joinByRank(int indexOne, int indexTwo)
    {
        int first = findParent(indexOne);
        int second = findParent(indexTwo);
        if (first == second)
        {
            return;
        }

        if (rank[first] >= rank[second])
        {
            parent[second] = first;
            rank[first] += rank[second];
        }
        else
        {
            parent[first] = second;
            rank[second] += rank[first];
        }
    }
}
