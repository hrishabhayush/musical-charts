// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

interface ISERC20 {
    error SERC20InvalidApprover(address account);

    error SERC20InvalidSpender(address account);

    event Approval(address owner, address spender, uint256 value);

    function totalSupply() external view returns (uint256);

    function balanceOf() external view returns (uint256);

    function balanceOfWithParams(saddress account) external view returns (uint256);

    function transfer(saddress to, suint256 value) external returns (bool);

    function allowance(saddress owner, saddress spender) external view returns (uint256);

    function approve(saddress spender, suint256 value) external returns (bool);

    function transferFrom(saddress from, saddress to, suint256 value) external returns (bool);
}

contract SERC20 is ISERC20 {
    suint256 _totalSupply;
    mapping(saddress => suint256) _balances;
    mapping(saddress account => mapping(saddress spender => suint256)) _allowances;

    string private _name;
    string private _symbol;

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    function mint(saddress account, suint256 value) public virtual {
        suint256 balance = _balances[account];
        _balances[account] = balance + value;
        _totalSupply = _totalSupply + value;
    }

    function burn(saddress account, suint256 value) public virtual {
        suint256 balance = _balances[account];
        if (balance >= value) {
            _totalSupply = _totalSupply - value;
            _balances[account] = balance - value;
        } else {
            _totalSupply = _totalSupply - balance;
            _balances[account] = suint256(0);
        }
    }

    function totalSupply() public view returns (uint256) {
        saddress sender = saddress(msg.sender);
        // shielded value
        require(_balances[sender] > suint256(0), "must have balance in order to view total supply");
        return uint256(_totalSupply);
    }

    function balanceOf() public view returns (uint256) {
        saddress sender = saddress(msg.sender);
        return uint256(_balances[sender]);
    }

    function balanceOfWithParams(saddress account) public view returns (uint256) {
        return uint256(_balances[account]);
    }

    function transfer(saddress to, suint256 value) public returns (bool) {
        saddress sender = saddress(msg.sender);
        return _transfer(sender, to, value);
    }

    function _transfer(saddress from, saddress to, suint256 value) internal virtual returns (bool) {
        suint256 fromBalance = _balances[from];
        suint256 toBalance = _balances[to];

        require(fromBalance >= value, "insufficient funds");

        _balances[from] = fromBalance - value;
        _balances[to] = toBalance + value;

        return true;
    }

    function allowance(saddress owner, saddress spender) public view returns (uint256) {
        saddress sender = saddress(msg.sender);
        require(sender == owner || sender == spender, "not authorized to view allowance");

        return uint256(_allowances[owner][spender]);
    }

    function approve(saddress spender, suint256 value) public returns (bool) {
        saddress sender = saddress(msg.sender);
        _approve(sender, spender, value, true);
        return true;
    }

    function _approve(saddress owner, saddress spender, suint256 value, bool emitEvent) internal virtual {
        saddress zero = saddress(address(0));
        if (owner == zero) {
            revert SERC20InvalidApprover(address(zero));
        }
        if (spender == zero) {
            revert SERC20InvalidSpender(address(zero));
        }
        _allowances[owner][spender] = value;
        if (emitEvent) {
            emit Approval(address(owner), address(spender), uint256(value));
        }
    }

    function transferFrom(saddress from, saddress to, suint256 value) public returns (bool) {
        saddress sender = saddress(msg.sender);
        suint256 fromAllowance = _allowances[from][sender];
        require(fromAllowance >= value, "exceeding allowance allotment");

        _allowances[from][sender] = fromAllowance - value;

        return _transfer(from, to, value);
    }
}
