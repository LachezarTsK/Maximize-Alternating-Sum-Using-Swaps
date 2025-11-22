
using System;

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
            unionFind.JoinByRank(swap[0], swap[1]);
        }

        ConnectedComponents[] parentToConnectedComponents
                 = CreateMapParentToConnectedComponents(input, unionFind);

        return CalculateMaxAlternatingSum(parentToConnectedComponents);
    }

    private ConnectedComponents[] CreateMapParentToConnectedComponents(int[] input, UnionFind unionFind)
    {
        var parentToConnectedComponents = new ConnectedComponents[input.Length];
        for (int i = 0; i < input.Length; ++i)
        {
            parentToConnectedComponents[i] = new ConnectedComponents();
        }

        for (int i = 0; i < input.Length; ++i)
        {
            int parent = unionFind.FindParent(i);
            if (IsEven(i))
            {
                ++parentToConnectedComponents[parent].numberOfEvenIndexes;
            }
            parentToConnectedComponents[parent].values.Add(input[i]);
        }

        return parentToConnectedComponents;
    }

    private long CalculateMaxAlternatingSum(ConnectedComponents[] parentToConnectedComponents)
    {
        long maxAlternatingSum = 0;
        foreach (var current in parentToConnectedComponents)
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

    private bool IsEven(int value)
    {
        return value % 2 == 0;
    }
}

class UnionFind
{
    readonly int[] parent;
    readonly int[] rank;

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

    public int FindParent(int index)
    {
        if (parent[index] != index)
        {
            parent[index] = FindParent(parent[index]);
        }
        return parent[index];
    }

    public void JoinByRank(int indexOne, int indexTwo)
    {
        int first = FindParent(indexOne);
        int second = FindParent(indexTwo);
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
