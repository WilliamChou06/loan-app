import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';
import Modal from 'antd/lib/modal';
import 'antd/lib/modal/style/css';

import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import 'antd/lib/form/style/css';
import 'antd/lib/input/style/css';

interface Props {
  visible: boolean;
  email: string;
  onCancel(): any;
  getFieldDecorator: any;
  form: any;
  getBalance(email: string): any;
}

const PaymentModal: React.FC<Props> = ({
  email,
  visible,
  onCancel,
  form,
  getBalance,
}) => {
  const [balance, setBalance] = useState();

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getBalance(email);
      setBalance(res.data.amount);
    };
    fetchBalance();
  }, [balance]);

  const handlePayment = async e => {
    e.preventDefault();
    form.validateFields(async (err, { amount }) => {
      try {
        const payDebtRes = await payDebt(amount);
        form.resetFields();
        setBalance(balance - amount);
      } catch (err) {
        console.log(err.response);
      }
    });
  };

  const payDebt = async amount => {
    try {
      return await axios.post('http://localhost:4000/payments', {
        email,
        amount,
      });
    } catch (err) {
      console.log(err.response);
    }
  };

  const { getFieldDecorator } = form;

  return (
    <Modal
      okText="Pay amount"
      visible={visible}
      onCancel={onCancel}
      onOk={handlePayment}
    >
      <Form>
        <h1>Debt: ${balance}</h1>
        <Form.Item>
          {getFieldDecorator('amount')(<Input placeholder="Amount" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const WrappedPaymentModal = Form.create({ name: 'payment_modal' })(
  PaymentModal
);

export default memo(WrappedPaymentModal);
