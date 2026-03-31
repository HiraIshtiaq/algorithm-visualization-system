export function coinChange(coins = [1, 2, 5], amount = 11) {
    const steps = [];

    steps.push({
        explanation: " Start",
        description: `Finding minimum coins for amount ${amount} using coins [${coins.join(', ')}]`,
        coins: coins,
        amount: amount,
        current: 0
    });

    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    for (let i = 1; i <= amount; i++) {
        for (let coin of coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                steps.push({
                    explanation: " Try Coin",
                    description: `Amount ${i}: using coin ${coin} → ${dp[i]} coins so far`,
                    amount: i,
                    coin: coin,
                    value: dp[i]
                });
            }
        }
    }

    steps.push({
        explanation: " Complete",
        description: `Minimum coins needed: ${dp[amount]}`,
        result: dp[amount]
    });

    return steps;
}