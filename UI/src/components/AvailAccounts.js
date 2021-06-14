import React, { useEffect, useState } from 'react';
import ContractHelper from './ContractHelper';

export default ({ accountSelected }) => {
    const [loading, setLoading] = useState(true);
    const [mainAccount, setMainAccount] = useState('0x0');
    const [allAccounts,] = useState([
        '0x9D913041fEC758A6BD6aa034AaC70759fe14eE06',
        '0xC6549699aA3DBB3Bf38D69f0fEf9709DE8a67F73',
        '0x8bf3b6f9C0888e0b9B84e41782C842ec9e6386fc',
        '0x2825e6a9c7f571acA4bA771daAe7BfA589fd2133',
        '0xc73D0840106eA5a1C8077Ca811adb03202d59d2f',
        '0xa5378cD20A2D6C27059ee9132A6853A5433649f8',
        '0x3f9653689268BD939826fA1422cb4a379d78c616',
        '0x821C0e1A6Fb9b5F03CCE50C975E113099E1db369',
        '0x0b352c310c3309D34578e6FA17724B16929fB0d3']);

    useEffect(() => {

        const initAccounts = async () => {
            await ContractHelper.init();
            setMainAccount((await ContractHelper.getAccounts())[0]);
            setLoading(false);
        }

        initAccounts();
    })

    const handleClick = account => {
        accountSelected(account);
    }

    return (
        <div className="col-md-12">
            <div className="">

                {loading ?
                    'Loading...' :
                    <table className="table table-hover table-stripped">
                        <tbody>
                            <tr>
                                <td>Your Account:</td>
                                <td>{mainAccount}</td>
                                <td>
                                    <button className="btn btn-sm btn-info" onClick={() => handleClick(mainAccount)}>
                                        Select
                                    </button>
                                </td>
                            </tr>
                            {allAccounts.map((item, i) => {
                                return <tr key={i}>
                                    <td>Account #{i + 2}</td>
                                    <td>{item}</td>
                                    <td>
                                        <button className="btn btn-sm btn-info" onClick={() => handleClick(item)}>
                                            Select
                                        </button>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                }

            </div>
        </div>
    );
}
