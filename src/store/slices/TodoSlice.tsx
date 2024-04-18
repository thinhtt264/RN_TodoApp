import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { PriorityType, TodoItemType, } from '../../common';
import { RootState } from '../store';



const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const appInit = createAsyncThunk('app/init', async () => {
    //generate random data when init app
    const dataArray = [];
    const priorityTypes = ['low', 'medium', 'high'];

    for (let i = 1; i <= 10; i++) {
        const id = i.toString();
        const title = `Task ${i}`;
        const priority = priorityTypes[getRandomNumber(0, 2)] as PriorityType;
        const isDone = Math.random() < 0.5;
        const time = getRandomNumber(Date.now(), Date.now() + 1000000000);

        const dataItem = { id, title, priority, isDone, time };
        dataArray.push(dataItem);
    }

    return dataArray;
});


export interface TodoState {
    TodoList: TodoItemType[]
}


const initialState: TodoState = {
    TodoList: []
};


const todoSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        onAddTask: (state, { payload }: PayloadAction<TodoItemType>) => {
            state.TodoList = [payload, ...state.TodoList]
        },
        onEditTask: (state, { payload }: PayloadAction<TodoItemType>) => {
            const index = state.TodoList.findIndex(item => item.id === payload.id)
            if (index === -1) return

            state.TodoList[index] = { ...state.TodoList[index], ...payload };
        },
        onDeleteTask: (state, { payload }: PayloadAction<{ id: string }>) => {
            state.TodoList = state.TodoList.filter((item) => item.id !== payload.id);
        }
    },
    extraReducers: builder => {
        builder.addCase(appInit.fulfilled, (state, action) => {
            state.TodoList = action.payload
        });
    },
});
export const { reducer: todoReducer, actions: todoActions } = todoSlice;

export const sortedTodoListSelector = createSelector(
    (state: RootState) => state.todo.TodoList,
    (_state: RootState, ascendingOrder: boolean) => ascendingOrder,
    (todoList, ascendingOrder) => {
        const priorityOrder: Record<PriorityType, number> = {
            high: 3,
            medium: 2,
            low: 1,
        };

        const sortedTodoList = [...todoList].sort((a, b) => {
            const priorityA = priorityOrder[a.priority] || 0;
            const priorityB = priorityOrder[b.priority] || 0;

            if (ascendingOrder) {
                return priorityA - priorityB;
            } else {
                return priorityB - priorityA;
            }
        });

        return sortedTodoList;
    }
);