import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box
} from '@mui/material';

function TaskModal({ open, handleClose, taskData, setTaskData, handleSubmit }) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thêm nhiệm vụ mới</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Tiêu đề"
            value={taskData.title}
            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
            required
            fullWidth
          />
          
          <TextField
            label="Mô tả"
            value={taskData.description || ''}
            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            multiline
            rows={3}
            fullWidth
          />
          
          <TextField
            label="Ngày đến hạn"
            type="date"
            value={taskData.due_date}
            onChange={(e) => setTaskData({ ...taskData, due_date: e.target.value })}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={taskData.completed || false}
                onChange={(e) => setTaskData({ ...taskData, completed: e.target.checked })}
              />
            }
            label="Đã hoàn thành"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Thêm nhiệm vụ
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskModal;