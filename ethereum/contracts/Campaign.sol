// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        mapping(address => bool) approvals; // those who have said yes to the transaction
        uint256 approvalsCount; // count of those who have said yes to the transaction
    }

    Request[] public requests;
    uint256 public numRequests;
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers; // the contributors
    uint256 public approversCount; // count of the contributors

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address recipient
    ) public restricted {
        Request storage r = requests.push();
        numRequests++;
        r.description = description;
        r.value = value;
        r.recipient = payable(recipient);
        r.complete = false;
        r.approvalsCount = 0;
    }

    function approveRequest(uint256 index) public {
        require(approvers[msg.sender]);
        Request storage request = requests[index];
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalsCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalsCount > (approversCount / 2));

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}
