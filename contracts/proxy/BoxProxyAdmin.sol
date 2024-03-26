// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

contract BoxProxyAdmin is ProxyAdmin {
  // we fill the constructor with an address to work with hardhat deploy plugin
  constructor(address /* owner */) ProxyAdmin() {
    // We just need this for our hardhat tooling
  }
}
