import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { CardActions } from 'material-ui';
import { DatePicker } from 'antd';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export default function AddressForm() {
    function createNewElement() {
        // First create a DIV element.
        var txtNewInputBox = document.createElement('div');
    
        // Then add the content (a new input box) of the element.
        txtNewInputBox.innerHTML = "<input type='text' id='newInputBox'>";
    
        // Finally put it where it is supposed to appear.
        document.getElementById("newElementId").appendChild(txtNewInputBox);
    }

    function displayChoice(){
        var num = document.getElementById("numberofChoice").value;
        console.log(num);
        for (let i = 0; i < num; ++i){
            console.log(i);
        }
    }

    const [form] = Form.useForm();
    const keyArray = [];
    const valueArray = [];

    const onFinish = values => {
      let s = values["choice"].length;
      for (let i = 0; i < s; ++i){
        // console.log(values["choice"][i].first);
        keyArray.push(values["choice"][i].first);
        // console.log(values["choice"][i].last);
        valueArray.push(values["choice"][i].last);
      }
      alert("Choice Submitted");
      localStorage.setItem("keyArray", keyArray);
      localStorage.setItem("valueArray", valueArray);
    };

    const handleChange = () => {
      form.setFieldsValue({ sights: [] });
    };


  return (
    <React.Fragment>
      {/* <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography> */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="pollName"
            name="pollName"
            label="Poll Name"
            fullWidth
            autoComplete="given-name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="pollDuration"
            name="pollDuration"
            label="Poll Duration (in seconds)"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="pollDescription"
            name="pollDescription"
            label="Poll Description"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          Blind Vote <input type = "checkbox" id = "blindVote"/> 
        </Grid>
        <Grid item xs={12} sm={6}>
          About DAO or Not<input type = "checkbox" id = "aboutDao"/> 
        </Grid>
        <Grid item xs={12} sm={6}>
          <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" align = "center">
            <Form.List name="choice">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'first']}
                        rules={[{ required: true, message: 'Missing key value' }]}
                      >
                        <Input placeholder="Choice Key" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'last']}
                        rules={[{ required: true, message: 'Missing key description' }]}
                      >
                        <Input placeholder="Description" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add field
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}