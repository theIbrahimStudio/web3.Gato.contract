// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract SubscriptionManager {
  address public tokenAddress;
  address public owner;

  enum Plan { None, Free, ProMonthly, ProYearly, EnterpriseMonthly, EnterpriseYearly }

  struct Subscription {
    Plan plan;
    uint256 expiresAt;
  }

  mapping(address => Subscription) public subscriptions;

  event Subscribed(address indexed user, Plan plan, uint256 expiresAt);

  modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized");
    _;
  }

  constructor(address _tokenAddress) {
    tokenAddress = _tokenAddress;
    owner = msg.sender;
  }

  function subscribe(Plan plan, uint256 amount, uint256 durationInDays) external {
    require(plan != Plan.None, "Invalid plan");

    IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);

    uint256 expiresAt = block.timestamp + (durationInDays * 1 days);
    subscriptions[msg.sender] = Subscription(plan, expiresAt);

    emit Subscribed(msg.sender, plan, expiresAt);
  }

  function getSubscription(address user) public view returns (Subscription memory) {
    return subscriptions[user];
  }

  function withdrawTokens(address to, uint256 amount) external onlyOwner {
    IERC20(tokenAddress).transferFrom(address(this), to, amount);
  }
}
