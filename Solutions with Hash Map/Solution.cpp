
#include <span>
#include <vector>
#include <ranges>
#include <unordered_map>
using namespace std;

class UnionFind {

    vector<int> parent;
    vector<int> rank;

public:
    UnionFind(int numberOfElements) {
            parent.resize(numberOfElements);
            rank.resize(numberOfElements);
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
            }
            else {
                    parent[first] = second;
                    rank[second] += rank[first];
            }
    }
};

struct ConnectedComponents {

    int numberOfEvenIndexes = 0;
    vector<int> values;
};

class Solution {

public:
    long long maxAlternatingSum(vector<int>& input, vector<vector<int>>& swaps) const {
        UnionFind unionFind(input.size());
        for (const auto& swap : swaps) {
            unionFind.joinByRank(swap[0], swap[1]);
        }

        unordered_map<int, ConnectedComponents> parentToConnectedComponents
                = createMapParentToConnectedComponents(input, unionFind);

        return calculateMaxAlternatingSum(parentToConnectedComponents);
    }

private:
    unordered_map<int, ConnectedComponents> createMapParentToConnectedComponents(span<const int>input, UnionFind& unionFind) const {
        unordered_map<int, ConnectedComponents> parentToConnectedComponents;
        for (int i = 0; i < input.size(); ++i) {
            int parent = unionFind.findParent(i);
            if (isEven(i)) {
                ++parentToConnectedComponents[parent].numberOfEvenIndexes;
            }
            parentToConnectedComponents[parent].values.push_back(input[i]);
        }

        return parentToConnectedComponents;
    }

    long long calculateMaxAlternatingSum(unordered_map<int, ConnectedComponents>& parentToConnectedComponents) const {
        long long maxAlternatingSum = 0;
        for (auto& [parent, connectedComponent] : parentToConnectedComponents) {
            ranges::sort(connectedComponent.values, greater<int>{});
            for (int i = 0; i < connectedComponent.numberOfEvenIndexes; ++i) {
                maxAlternatingSum += connectedComponent.values[i];
            }
            for (int i = connectedComponent.numberOfEvenIndexes; i < connectedComponent.values.size(); ++i) {
                maxAlternatingSum -= connectedComponent.values[i];
            }
        }
        return maxAlternatingSum;
    }

    bool isEven(int value) const {
        return value % 2 == 0;
    }
};
