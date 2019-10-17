/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AuthorityContract extends Contract {

    async authorityExists(ctx, authorityId) {
        const buffer = await ctx.stub.getState(authorityId);
        return (!!buffer && buffer.length > 0);
    }

    async createAuthority(ctx,details) {
        const authorityDetails = JSON.parse(details);
        const exists = await this.authorityExists(ctx, authorityDetails.authorityId);
        if (exists) {
            throw new Error(`The authority ${authorityDetails.authorityId} already exists`);
        }
        const buffer = Buffer.from(JSON.stringify(authorityDetails));
        await ctx.stub.putState(authorityDetails.authorityId, buffer);
    }

    async readAuthority(ctx, authorityId) {
        const exists = await this.authorityExists(ctx, authorityId);
        if (!exists) {
            throw new Error(`The authority ${authorityId} does not exist`);
        }
        const buffer = await ctx.stub.getState(authorityId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateAuthority(ctx, authorityId, newValue) {
        const exists = await this.authorityExists(ctx, authorityId);
        if (!exists) {
            throw new Error(`The authority ${authorityId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(authorityId, buffer);
    }

    async deleteAuthority(ctx, authorityId) {
        const exists = await this.authorityExists(ctx, authorityId);
        if (!exists) {
            throw new Error(`The authority ${authorityId} does not exist`);
        }
        await ctx.stub.deleteState(authorityId);
    }
    async isProofExists(ctx, proofHash) {
        const buffer = await ctx.stub.getState(proofHash);
        return (!!buffer && buffer.length > 0);
    }
    async publishProof(ctx,proofDetails){
        const details = JSON.parse(proofDetails);
        const exists = await this.isProofExists(ctx, details.proof.agreementHash);
        if (exists) {
            throw new Error(`The ProofHash ${details.proof.agreementHash} already exists`);
        }
        const buffer = Buffer.from(JSON.stringify(details));
        await ctx.stub.putState(details.proof.agreementHash, buffer);

    }

    async getproofDetails(ctx,agreementHash){
        const exists = await this.isProofExists(ctx, agreementHash);
        if (!exists) {
            throw new Error(`The ProofHash ${agreementHash} does not exist`);
        }
        const buffer = await ctx.stub.getState(agreementHash);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }
}

module.exports = AuthorityContract;
