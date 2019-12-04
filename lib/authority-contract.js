/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AuthorityContract extends Contract {

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
