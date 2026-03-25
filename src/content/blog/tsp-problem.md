---
title: 'TSP 问题，Held-Karp 算法与 Christofides 算法'
description: '了解 DP 解法 Held-Karp 算法与近似解法 Christofides 算法'
date: '2026-03-25'
tags: ['技术', '算法']
image: '/images/tsp-problem.png'
---

## 问题引入：什么是 TSP 问题？

TSP 问题要求我们在一个完全加权图中，找一个权重之和最小的哈密尔顿回路。更简单地来说：他要求我们在一个地图中，从一个点开始，走一条用时最短的路径，不重复地经过所有点，最后回到起点。

对于此类问题，我们有一种精确的、性能较低的 DP 解法 Held-Karp 算法；另外我们还有一种可以求得近似解的、性能较高的解法 Christofides 算法。

## Held-Karp DP 解法

Held-Karp 解法是一种 **状压 DP** 解法。让我们回顾一下可以使用 DP 算法的前提：一个答案可以分成若干个对子问题的决策，同时决策的做出只和上一步决策如何有关，不关心上一步决策如何得到；我们可以将重复子问题的数据按照一定格式存储，确保每个子问题只解决一次。

当然，DP 是忽略“求得解的过程”的——那么在对“不能重复经过同一个点”进行要求之后，我们还可以使用 DP 来求解吗？当然可以，只要我们改变区分子问题的方式即可。我们引入两点来区分子问题：**经过了哪些地方**和**最终停在哪个地方**。对于具体经过了哪些地方，我们可以引入“状压DP”的思想。

在 Held-Karp 解法中，我们按照路径的长度分步考虑。假设存在这样一个存在 $n$ 个点的图，我们将起点记为 $0$ ，剩余点分别记为 $1 \dots n - 1$ 。

创建一个表 $dp$ 来存储经过特定几个点而来到某个点之后所需要的最短时间：存在 $2^{ n - 1 }$ 行，每一行的行号转换为二进制后从右向左第 $i$ 位代表着路径中经过了点 $i$ ；存在 $n - 1$ 列，代表其目前所在的位置。例如，对于一个 $4$ 个点的如此的图，我们经过了 $0 \to 3 \to 2$  的路径，且这样做的时间最短，那么我们就把经过这个路径的时间存在 $dp[110][2]$ 中。状态转移方程如下：（我们把经过了哪些地方的二进制表达视作 $R$ ）

$$
dp[R][j] = \min(dp[R \backslash i] + d[i][j], dp[R][j])
$$

在实际编写程序时，我们按照路径的的长度 $s$ 从小到大进行遍历，这样我们就不会涉及到重复求解子问题或求解子问题时前置的子问题还没有解决的情况。

解决代码如下：

```python
from math import inf

d = [
    [1, 2, 3, 4],
    [4, 3, 5, 1],
    [6, 6, 7, 8],
    [2, 3, 4, 5],
]
n = len(d)

def get_s(num):
    s = 0
    while num > 0:
        s += num % 2
        num >>= 1
    return s

def get_route(s):
    for r in range(1, 1 << (n - 1)):
        if get_s(r) == s:
            yield r

def get_destination(s):
    for dest in range(1, n):
        if (s >> (dest - 1)) % 2 == 1:
            yield dest

def get_goto(route, dest):
    for goto in range(1, n):
        if (route >> (goto - 1)) % 2 == 0 and goto != dest:      
            yield goto

# d[i][j] means the distance between i and j.

# Initialize DP.
dp = [[inf for j in range(n)] for i in range(1 << (n - 1))]
for i in range(1, n):
    dp[1 << (i - 1)][i] = d[0][i]

# Into the recursion.
for s in range(1, n - 1):
    for route in get_route(s):
        for dest in get_destination(route):
            for goto in get_goto(route, dest):
                new_route = route + (1 << (goto - 1))
                new_time = dp[route][dest] + d[dest][goto]
                if (new_time < dp[new_route][goto]):
                    dp[new_route][goto] = new_time

# Get the final answer.
answer = inf
for endpoint in range(1, n):
    final_t = dp[2 ** (n - 1) - 1][endpoint] + d[endpoint][0]
    if dp[2 ** (n - 1) - 1][endpoint] + d[endpoint][0] < answer:
        answer = final_t        

print(answer)
```

## Christofides 解法

Christofides 解法是一种相对比较准确的快速解法，能够找到一种与正确答案相差不超过 1.5 倍的近似解。它的做法如下：

1. 先找到联通所有点的最小生成树（MST）。
    
    我们可以利用 Kruskal 算法来找到最小生成树：
    
    1. 先将所有的边按照权重从小到大进行排序。
    2. 每次都选择权重最小的边，检查其连接的两个点是否属于同一连通分量（这里考虑的是我们已经之前选择的边），如果不属于就选择，属于就丢弃。
    3. 重复直到选了 $n - 1$ 条边。
2. 在树中找到每一个奇度数的顶点。
3. 将所有的奇度数顶点进行最小完美匹配（将 $2n$ 个点连成 $n$ 对，使得总权重最小） 
4. 将最小生成树和最小完美匹配进行合并，找出欧拉回路
5. 通过跳过重复点的方式找到我们希望求出的解。