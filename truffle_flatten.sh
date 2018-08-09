#!/usr/bin/env bash

node ./node_modules/.bin/truffle-flattener ./contracts/WakERC20Token.sol > ./contracts-flat/FLAT-WakERC20Token.sol;

node ./node_modules/.bin/truffle-flattener ./contracts/Migrations.sol > ./contracts-flat/FLAT-Migrations.sol;
