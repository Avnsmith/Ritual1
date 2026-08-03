// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title WowWebProofRegistry
 * @dev Stores verifiable execution proof commitments for WowWeb AI Browser Agents on RitualNet.
 */
contract WowWebProofRegistry {
    enum Status { Pending, Verified, Failed }

    struct ExecutionProof {
        bytes32 executionId;
        bytes32 promptHash;
        bytes32 executionHash;
        bytes32 outputHash;
        bytes32 visitedUrlsHash;
        string agentId;
        address ownerWallet;
        uint256 timestamp;
        Status status;
        bool isVerified;
        string metadataUri;
    }

    mapping(bytes32 => ExecutionProof) public proofs;
    mapping(address => bytes32[]) public ownerProofs;
    bytes32[] public allProofIds;
    address public relayer;

    event ProofRecorded(
        bytes32 indexed executionId,
        address indexed ownerWallet,
        string agentId,
        bytes32 promptHash,
        bytes32 outputHash,
        uint256 timestamp
    );

    event ProofVerified(
        bytes32 indexed executionId,
        address indexed ownerWallet,
        uint256 timestamp
    );

    event ProofStatusUpdated(
        bytes32 indexed executionId,
        Status status
    );

    modifier onlyRelayerOrOwner(bytes32 executionId) {
        require(msg.sender == relayer || msg.sender == proofs[executionId].ownerWallet, "Not authorized");
        _;
    }

    constructor() {
        relayer = msg.sender;
    }

    function recordProof(
        bytes32 executionId,
        bytes32 promptHash,
        bytes32 executionHash,
        bytes32 outputHash,
        bytes32 visitedUrlsHash,
        string calldata agentId,
        address ownerWallet,
        string calldata metadataUri
    ) external {
        require(proofs[executionId].timestamp == 0, "Proof already exists");

        proofs[executionId] = ExecutionProof({
            executionId: executionId,
            promptHash: promptHash,
            executionHash: executionHash,
            outputHash: outputHash,
            visitedUrlsHash: visitedUrlsHash,
            agentId: agentId,
            ownerWallet: ownerWallet,
            timestamp: block.timestamp,
            status: Status.Verified,
            isVerified: true,
            metadataUri: metadataUri
        });

        ownerProofs[ownerWallet].push(executionId);
        allProofIds.push(executionId);

        emit ProofRecorded(executionId, ownerWallet, agentId, promptHash, outputHash, block.timestamp);
        emit ProofVerified(executionId, ownerWallet, block.timestamp);
    }

    function getProof(bytes32 executionId) external view returns (ExecutionProof memory) {
        return proofs[executionId];
    }

    function getProofsByOwner(address owner) external view returns (bytes32[] memory) {
        return ownerProofs[owner];
    }

    function getTotalProofs() external view returns (uint256) {
        return allProofIds.length;
    }
}
