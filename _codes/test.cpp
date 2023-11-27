#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int findMaximumLength(vector<int>& nums) {
        int n = nums.size();
        vector<int> dp(n, 1);   // dp[i] 表示以 nums[i] 结尾的最长非递减子数组的长度
        vector<int> arr(n);
        arr[0] = nums[0];
        for(int i = 1; i < n; i++) arr[i] = arr[i-1] + nums[i];

        vector<int> maxnum(n, 0);
        maxnum[0] = nums[0];

        for(int i = 1; i < n; i++) {
            int idx = i - 1;  // 修正索引的初始值
            while(idx >= 0 && maxnum[idx] < nums[i]) {
                maxnum[idx + 1] = maxnum[idx] + nums[i];  // 更新 maxnum 数组
                idx--;
            }
            maxnum[idx + 1] = nums[i];  // 确保正确更新 maxnum 数组
        }
        
        int maxLength = 1;

        for (int i = 1; i < n; ++i) {
            for (int j = 0; j < i; ++j) {
                int j_i = arr[j] - arr[i];  // 修正 j_i 的计算方式
                int jj = maxnum[j];
                if (j_i >= jj) {
                    dp[i] = max(dp[i], dp[j] + 1); // 更新最长非递减子数组的长度
                }
            }

            maxLength = max(maxLength, dp[i]);
        }

        return maxLength;
    }
};
