/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { AuthorityContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('AuthorityContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new AuthorityContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"authority 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"authority 1002 value"}'));
    });

    describe('#authorityExists', () => {

        it('should return true for a authority', async () => {
            await contract.authorityExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a authority that does not exist', async () => {
            await contract.authorityExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createAuthority', () => {

        it('should create a authority', async () => {
            await contract.createAuthority(ctx, '1003', 'authority 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"authority 1003 value"}'));
        });

        it('should throw an error for a authority that already exists', async () => {
            await contract.createAuthority(ctx, '1001', 'myvalue').should.be.rejectedWith(/The authority 1001 already exists/);
        });

    });

    describe('#readAuthority', () => {

        it('should return a authority', async () => {
            await contract.readAuthority(ctx, '1001').should.eventually.deep.equal({ value: 'authority 1001 value' });
        });

        it('should throw an error for a authority that does not exist', async () => {
            await contract.readAuthority(ctx, '1003').should.be.rejectedWith(/The authority 1003 does not exist/);
        });

    });

    describe('#updateAuthority', () => {

        it('should update a authority', async () => {
            await contract.updateAuthority(ctx, '1001', 'authority 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"authority 1001 new value"}'));
        });

        it('should throw an error for a authority that does not exist', async () => {
            await contract.updateAuthority(ctx, '1003', 'authority 1003 new value').should.be.rejectedWith(/The authority 1003 does not exist/);
        });

    });

    describe('#deleteAuthority', () => {

        it('should delete a authority', async () => {
            await contract.deleteAuthority(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a authority that does not exist', async () => {
            await contract.deleteAuthority(ctx, '1003').should.be.rejectedWith(/The authority 1003 does not exist/);
        });

    });

});