import React, { useState } from 'react';
import type { TargetTask, TaskCategoryConfig } from '../types';
import { 
  Plus, Check, Trash2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Sparkles, Flag, ArrowUp, ArrowDown, PieChart, ArrowLeft, Settings2, Palette
} from 'lucide-react';

// 20 Preset MUJI x Morandi Pale Colors
const MORANDI_PRESET_COLORS = [
  { name: '雾霾蓝', color: '#71859A' },
  { name: '苔藓绿', color: '#4B7B61' },
  { name: '烟灰紫', color: '#7168A4' },
  { name: '暖柿橙', color: '#D98236' },
  { name: '莫兰迪红', color: '#E74C3C' },
  { name: '亚麻棕', color: '#9A8068' },
  { name: '燕麦灰', color: '#9AA89C' },
  { name: '鼠尾草绿', color: '#7FA188' },
  { name: '黛蓝', color: '#5C768D' },
  { name: '豆沙红', color: '#B86B77' },
  { name: '奶茶棕', color: '#B8997D' },
  { name: '陶土黄', color: '#C49A45' },
  { name: '灰冰蓝', color: '#89A4B1' },
  { name: '薄荷绿', color: '#85A894' },
  { name: '丁香紫', color: '#9986A5' },
  { name: '暖羊绒', color: '#B5A895' },
  { name: '杏仁灰', color: '#9E9689' },
  { name: '极简黑粉', color: '#BA7C86' },
  { name: '蓝绿灰', color: '#628C86' },
  { name: '日系竹青', color: '#6F8B66' },
];

interface TargetViewProps {
  targets: TargetTask[];
  categories: TaskCategoryConfig[];
  onToggleTask: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onToggleTaskFlag: (id: string) => void;
  onToggleSubtaskFlag: (taskId: string, subtaskId: string) => void;
  onAddTask: (title: string, category: string, color: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onDeleteTask: (id: string) => void;
  onAddCategory: (name: string, color: string) => void;
  onReorderTasks: (fromIndex: number, toIndex: number) => void;
  onSummonAgent: () => void;
  onNewTopic: () => void;
  onBackToHome: () => void;
}

export const TargetView: React.FC<TargetViewProps> = ({
  targets,
  categories,
  onToggleTask,
  onToggleSubtask,
  onToggleTaskFlag,
  onToggleSubtaskFlag,
  onAddTask,
  onAddSubtask,
  onDeleteTask,
  onAddCategory,
  onReorderTasks,
  onSummonAgent,
  onNewTopic,
  onBackToHome
}) => {
  const [viewMode, setViewMode] = useState<'detailed' | 'preview'>('detailed');
  const [selectedDate, setSelectedDate] = useState<number>(25);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('工作');

  const [addingSubtaskTaskId, setAddingSubtaskTaskId] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const [showCategorySettings, setShowCategorySettings] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#71859A');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const activeCategoryConfig = categories.find(c => c.name === selectedCategoryName) || categories[0];

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle, selectedCategoryName, activeCategoryConfig.color);
    setNewTaskTitle('');
  };

  const handleCreateSubtask = (taskId: string) => {
    if (!newSubtaskTitle.trim()) return;
    onAddSubtask(taskId, newSubtaskTitle);
    setNewSubtaskTitle('');
    setAddingSubtaskTaskId(null);
  };

  const handleCreateCategory = () => {
    if (!newCatName.trim()) return;
    onAddCategory(newCatName, newCatColor);
    setNewCatName('');
  };

  // Group tasks for stats
  const categoryStats: { [catName: string]: { total: number; completed: number; color: string } } = {};
  categories.forEach(c => {
    categoryStats[c.name] = { total: 0, completed: 0, color: c.color };
  });

  targets.forEach(t => {
    if (!categoryStats[t.category]) {
      categoryStats[t.category] = { total: 0, completed: 0, color: t.color || '#71859A' };
    }
    categoryStats[t.category].total += 1;
    if (t.completed) categoryStats[t.category].completed += 1;
  });

  return (
    <div className="target-page-wrapper animate-fade-in">
      {/* Universal Top Bar */}
      <div className="target-header-bar">
        <div className="bar-left">
          <button className="icon-only-btn" onClick={onBackToHome} title="返回首页">
            <ArrowLeft size={18} />
          </button>
          <h2 className="bar-title font-serif">目标</h2>
        </div>

        {/* View Mode Segment Switcher */}
        <div className="view-mode-toggle font-serif">
          <button 
            className={`toggle-btn ${viewMode === 'detailed' ? 'active' : ''}`}
            onClick={() => setViewMode('detailed')}
          >
            详细版
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
            onClick={() => setViewMode('preview')}
          >
            阅览版
          </button>
        </div>

        <div className="bar-right">
          <button className="icon-only-btn agent-btn" onClick={onSummonAgent} title="召唤 Agent">
            <Sparkles size={18} className="sparkle-icon" />
          </button>
          <button className="icon-only-btn" onClick={onNewTopic} title="新建">
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Main Grid & Task Content */}
      <div className="target-body-scroll">
        <div className="target-body-container">
          
          {/* Equal Grid Full-Month Calendar */}
          <div className="equal-calendar-card card-paper">
            <div className="cal-top-row font-serif">
              <div className="month-display">
                <span>2026年7月</span>
                <div className="cal-nav-arrows">
                  <button><ChevronLeft size={16} /></button>
                  <button><ChevronRight size={16} /></button>
                </div>
              </div>
              <span className="cal-tip-text font-serif">
                {viewMode === 'detailed' ? '详细版：展现月历所有任务名称 (超6项折叠)' : '阅览版：仅渲染极简分类彩色斑点'}
              </span>
            </div>

            {/* Strict 7-column equal grid */}
            <div className="equal-grid-wrapper">
              {['日', '一', '二', '三', '四', '五', '六'].map((day, idx) => (
                <div key={idx} className="equal-day-header font-serif">{day}</div>
              ))}

              {Array.from({ length: 35 }, (_, i) => {
                const dateNum = i - 3 + 1;
                const isCurrentMonth = dateNum >= 1 && dateNum <= 31;
                const isSelected = dateNum === selectedDate;

                const dayTasks = isCurrentMonth && dateNum === 25 ? targets : [];

                return (
                  <div
                    key={i}
                    className={`equal-grid-cell ${!isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => isCurrentMonth && setSelectedDate(dateNum)}
                  >
                    <div className="cell-top-number">
                      <span className="num font-serif">{isCurrentMonth ? dateNum : ''}</span>
                      {isSelected && <span className="selected-dot">●</span>}
                    </div>

                    {/* Detailed View */}
                    {isCurrentMonth && viewMode === 'detailed' && (
                      <div className="cell-task-names-list">
                        {dayTasks.slice(0, 5).map(task => (
                          <div 
                            key={task.id} 
                            className={`name-item-line ${task.completed ? 'completed' : ''}`}
                            style={{ borderLeftColor: task.color }}
                          >
                            {task.flagged && <span className="flag-icon-mini">🚩</span>}
                            <span className="text">{task.title}</span>
                          </div>
                        ))}
                        {dayTasks.length > 5 && (
                          <span className="fold-more-tag">+{dayTasks.length - 5} 更多</span>
                        )}
                      </div>
                    )}

                    {/* Preview View Color Dots Row */}
                    {isCurrentMonth && viewMode === 'preview' && (
                      <div className="cell-color-dots-row">
                        {dayTasks.map(task => (
                          <span 
                            key={task.id} 
                            className="color-dot-pill" 
                            style={{ backgroundColor: task.color }}
                            title={`${task.category}: ${task.title}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Task Management Panel */}
          <div className="date-tasks-panel card-paper">
            <div className="panel-head-row font-serif">
              <div className="date-title">
                <CalendarIcon size={18} className="icon-brown" />
                <h3>7月{selectedDate}日 · 任务清单</h3>
              </div>

              <div className="category-picker-bar font-serif">
                <span className="label">选择类型:</span>
                {categories.map(c => (
                  <button
                    key={c.id}
                    className={`cat-pick-btn ${selectedCategoryName === c.name ? 'active' : ''}`}
                    onClick={() => setSelectedCategoryName(c.name)}
                    style={{ 
                      borderColor: c.color, 
                      color: selectedCategoryName === c.name ? '#FFF' : c.color, 
                      backgroundColor: selectedCategoryName === c.name ? c.color : 'transparent' 
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Create Task Form */}
            <div className="create-task-form">
              <input
                type="text"
                placeholder={`在 [${selectedCategoryName}] 下添加新目标任务...`}
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateTask()}
                className="task-title-input"
              />
              <button className="add-task-btn" onClick={handleCreateTask}>
                <Plus size={16} /> <span>添加任务</span>
              </button>
            </div>

            {/* List of Tasks */}
            <div className="tasks-interactive-list">
              {targets.map((task, index) => (
                <div 
                  key={task.id} 
                  className={`task-card-item ${task.completed ? 'completed' : ''}`}
                  style={{ borderLeftColor: task.color }}
                >
                  <div className="task-row-top">
                    <button 
                      className={`custom-check-box ${task.completed ? 'checked' : ''}`}
                      onClick={() => onToggleTask(task.id)}
                      style={{ borderColor: task.color, backgroundColor: task.completed ? task.color : 'transparent' }}
                    >
                      {task.completed && <Check size={12} color="#FFF" />}
                    </button>

                    <button 
                      className={`flag-btn ${task.flagged ? 'flagged' : ''}`}
                      onClick={() => onToggleTaskFlag(task.id)}
                      title={task.flagged ? '取消小红旗' : '点亮小红旗'}
                    >
                      <Flag size={14} className={task.flagged ? 'icon-flag-red' : ''} />
                    </button>

                    <span className="task-title-text font-serif">{task.title}</span>

                    <span className="category-badge" style={{ backgroundColor: task.color + '20', color: task.color }}>
                      {task.category}
                    </span>

                    <div className="reorder-btns">
                      <button disabled={index === 0} onClick={() => onReorderTasks(index, index - 1)}><ArrowUp size={12} /></button>
                      <button disabled={index === targets.length - 1} onClick={() => onReorderTasks(index, index + 1)}><ArrowDown size={12} /></button>
                    </div>

                    <button className="delete-task-btn" onClick={() => setDeleteConfirmId(task.id)} title="删除任务">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Subtasks */}
                  <div className="subtasks-container">
                    {task.subtasks && task.subtasks.map(sub => (
                      <div key={sub.id} className={`subtask-row ${sub.completed ? 'completed' : ''}`}>
                        <button className="sub-check-box" onClick={() => onToggleSubtask(task.id, sub.id)}>
                          <span className={`dot ${sub.completed ? 'checked' : ''}`}></span>
                        </button>
                        <button className="sub-flag-btn" onClick={() => onToggleSubtaskFlag(task.id, sub.id)}>
                          <Flag size={12} className={sub.flagged ? 'icon-flag-red' : 'icon-muted'} />
                        </button>
                        <span className="sub-title">{sub.title}</span>
                        {sub.time && <span className="sub-time">{sub.time}</span>}
                      </div>
                    ))}

                    {addingSubtaskTaskId === task.id ? (
                      <div className="add-subtask-form">
                        <input
                          type="text"
                          placeholder="输入子任务名称..."
                          value={newSubtaskTitle}
                          onChange={e => setNewSubtaskTitle(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleCreateSubtask(task.id)}
                          autoFocus
                          className="subtask-input"
                        />
                        <button className="sub-save-btn" onClick={() => handleCreateSubtask(task.id)}>确定</button>
                        <button className="sub-cancel-btn" onClick={() => setAddingSubtaskTaskId(null)}>取消</button>
                      </div>
                    ) : (
                      <button className="add-subtask-trigger" onClick={() => setAddingSubtaskTaskId(task.id)}>
                        <Plus size={12} /> <span>新增子任务</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Statistics Summary Section with 20 MUJI Morandi Color Presets Selector */}
          <div className="category-stats-summary-card card-paper">
            <div className="stats-head-bar font-serif">
              <div className="left font-serif">
                <PieChart size={18} className="icon-brown" />
                <h3>分类任务统计表</h3>
              </div>

              <button className="config-cats-btn" onClick={() => setShowCategorySettings(!showCategorySettings)}>
                <Settings2 size={14} />
                <span>配置类型与莫兰迪配色</span>
              </button>
            </div>

            {/* Dynamic Category Config Panel with 20 Morandi Color Palette */}
            {showCategorySettings && (
              <div className="cat-config-panel animate-fade-in font-serif">
                <h5>新增类型 & 选择 MUJI 20 款淡雅莫兰迪色调：</h5>
                <div className="cat-form">
                  <input
                    type="text"
                    placeholder="分类名称 (如 理财/读书/宠物)..."
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    className="cat-name-input"
                  />
                  <div className="selected-color-preview" style={{ backgroundColor: newCatColor }}>
                    <Palette size={12} color="#FFF" />
                  </div>
                  <button className="save-cat-btn" onClick={handleCreateCategory}>保存类型</button>
                </div>

                {/* 20 Morandi Color Grid Presets */}
                <div className="morandi-palette-grid">
                  {MORANDI_PRESET_COLORS.map(p => (
                    <div 
                      key={p.color}
                      className={`morandi-color-swatch ${newCatColor === p.color ? 'active' : ''}`}
                      style={{ backgroundColor: p.color }}
                      onClick={() => setNewCatColor(p.color)}
                      title={`${p.name} (${p.color})`}
                    >
                      {newCatColor === p.color && <Check size={10} color="#FFF" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Statistics Breakdown Grid */}
            <div className="category-stats-grid">
              {categories.map(c => {
                const stat = categoryStats[c.name] || { total: 0, completed: 0, color: c.color };
                return (
                  <div key={c.id} className="cat-stat-box" style={{ borderTopColor: c.color }}>
                    <div className="cat-box-name font-serif" style={{ color: c.color }}>
                      ● {c.name}
                    </div>
                    <div className="cat-box-numbers font-sans">
                      <span>总计 <strong>{stat.total}</strong> 项</span>
                      <span className="completed-text">已完成 <strong>{stat.completed}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-backdrop">
          <div className="confirm-dialog card-paper">
            <h4 className="font-serif">二次确认</h4>
            <p>确定要删除这个目标任务及其子任务吗？删除后不可恢复。</p>
            <div className="dialog-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteConfirmId(null)}>取消</button>
              <button className="btn btn-primary danger" onClick={() => { onDeleteTask(deleteConfirmId); setDeleteConfirmId(null); }}>确定删除</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .target-page-wrapper {
          flex: 1; height: 100vh; overflow: hidden;
          background-color: var(--bg-warm-paper); display: flex; flex-direction: column;
        }

        .target-header-bar {
          height: 56px; padding: 0 20px; display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid var(--border-color-light); background: rgba(245, 241, 233, 0.85);
          backdrop-filter: blur(8px); position: sticky; top: 0; z-index: 20;
        }

        .bar-left { display: flex; align-items: center; gap: 12px; }
        .icon-only-btn {
          width: 36px; height: 36px; border-radius: 50%; background: #FFFFFF;
          border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center;
          color: var(--text-main); cursor: pointer; transition: all 0.2s;
        }
        .icon-only-btn:hover { border-color: var(--primary-blue); color: var(--primary-blue); transform: translateY(-1px); }

        .bar-title { font-size: 18px; font-weight: 600; }

        .view-mode-toggle {
          display: flex; background: var(--bg-card-subtle); border: 1px solid var(--border-color);
          border-radius: var(--radius-full); padding: 3px;
        }

        .toggle-btn {
          border: none; background: none; padding: 4px 16px; font-size: 13px;
          color: var(--text-muted); cursor: pointer; border-radius: var(--radius-full);
        }
        .toggle-btn.active { background: #FFFFFF; color: var(--text-main); font-weight: 600; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }

        .bar-right { display: flex; gap: 10px; }
        .sparkle-icon { color: var(--primary-blue); }

        .target-body-scroll { flex: 1; overflow-y: auto; padding: 24px 0; }
        .target-body-container { max-width: 900px; margin: 0 auto; padding: 0 24px; display: flex; flex-direction: column; gap: 24px; }

        /* Strict Equal Grid Full-Month Calendar */
        .equal-calendar-card { padding: 20px 24px; }
        .cal-top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .month-display { display: flex; align-items: center; gap: 12px; font-size: 18px; font-weight: 600; }
        .cal-nav-arrows button { background: none; border: none; color: var(--text-muted); cursor: pointer; }
        .cal-tip-text { font-size: 12px; color: var(--text-light); }

        .equal-grid-wrapper { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
        .equal-day-header { text-align: center; font-size: 12px; color: var(--text-light); padding-bottom: 6px; }

        .equal-grid-cell {
          aspect-ratio: 1 / 0.95; background: #FAFAFA; border: 1px solid var(--border-color-light);
          border-radius: 8px; padding: 6px; display: flex; flex-direction: column; cursor: pointer; transition: all 0.15s; overflow: hidden;
        }

        .equal-grid-cell:hover { border-color: var(--primary-blue); }
        .equal-grid-cell.selected { border-color: var(--primary-blue); background: #FFFFFF; box-shadow: 0 0 0 2px var(--primary-blue-light); }
        .equal-grid-cell.other-month { opacity: 0.25; }

        .cell-top-number { display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 500; }
        .selected-dot { color: var(--primary-blue); font-size: 8px; }

        .cell-task-names-list { display: flex; flex-direction: column; gap: 2px; margin-top: 4px; overflow: hidden; }

        .name-item-line {
          font-size: 10px; padding: 1px 4px; border-left: 2px solid var(--primary-blue);
          background: rgba(0, 0, 0, 0.02); border-radius: 0 2px 2px 0; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 2px;
        }
        .name-item-line.completed { text-decoration: line-through; opacity: 0.5; color: var(--text-muted); }
        .flag-icon-mini { font-size: 8px; }
        .fold-more-tag { font-size: 9px; color: var(--text-muted); font-weight: bold; margin-top: 2px; }

        .cell-color-dots-row { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
        .color-dot-pill { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

        .date-tasks-panel { padding: 24px; }
        .panel-head-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .date-title { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 600; }

        .category-picker-bar { display: flex; align-items: center; gap: 6px; font-size: 12px; }
        .cat-pick-btn { border: 1px solid var(--border-color); border-radius: var(--radius-full); padding: 2px 10px; font-size: 11px; cursor: pointer; }

        .create-task-form { display: flex; gap: 10px; margin-bottom: 20px; }
        .task-title-input { flex: 1; background: #FAF8F5; border: 1px solid var(--border-color); border-radius: var(--radius-full); padding: 8px 16px; font-size: 13px; outline: none; }
        .add-task-btn { display: flex; align-items: center; gap: 6px; background: var(--primary-blue); color: #FFF; border: none; border-radius: var(--radius-full); padding: 8px 16px; font-size: 13px; cursor: pointer; }

        .tasks-interactive-list { display: flex; flex-direction: column; gap: 14px; }

        .task-card-item {
          background: #FFFFFF; border-top: 1px solid var(--border-color-light);
          border-right: 1px solid var(--border-color-light); border-bottom: 1px solid var(--border-color-light);
          border-left: 4px solid var(--primary-blue); border-radius: 0 var(--radius-md) var(--radius-md) 0;
          padding: 14px 18px; box-shadow: var(--shadow-sm); transition: all 0.2s;
        }

        .task-card-item.completed { opacity: 0.55; }
        .task-card-item.completed .task-title-text { text-decoration: line-through; color: var(--text-muted); }

        .task-row-top { display: flex; align-items: center; gap: 10px; }
        .custom-check-box { width: 18px; height: 18px; border-radius: 4px; border: 2px solid var(--primary-blue); display: flex; align-items: center; justify-content: center; cursor: pointer; background: none; }

        .flag-btn { background: none; border: none; cursor: pointer; padding: 2px; }
        .icon-flag-red { color: #E74C3C; }
        .icon-muted { color: var(--text-light); }

        .task-title-text { flex: 1; font-size: 14px; font-weight: 600; color: var(--text-main); }
        .category-badge { font-size: 10px; padding: 2px 8px; border-radius: 4px; font-weight: 500; }

        .reorder-btns { display: flex; gap: 2px; }
        .reorder-btns button { background: none; border: none; color: var(--text-light); cursor: pointer; padding: 2px; }
        .delete-task-btn { background: none; border: none; color: var(--text-light); cursor: pointer; }
        .delete-task-btn:hover { color: #E74C3C; }

        .subtasks-container { margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--border-color-light); display: flex; flex-direction: column; gap: 6px; padding-left: 28px; }
        .subtask-row { display: flex; align-items: center; gap: 8px; font-size: 12px; }
        .subtask-row.completed .sub-title { text-decoration: line-through; color: var(--text-muted); }
        .sub-check-box { background: none; border: none; cursor: pointer; padding: 2px; }
        .sub-check-box .dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid var(--text-muted); display: block; }
        .sub-check-box .dot.checked { background: var(--text-muted); }
        .sub-flag-btn { background: none; border: none; cursor: pointer; padding: 1px; }
        .sub-title { flex: 1; }
        .sub-time { font-size: 10px; color: var(--text-light); }

        .add-subtask-trigger { display: flex; align-items: center; gap: 4px; background: none; border: none; color: var(--text-muted); font-size: 11px; cursor: pointer; margin-top: 4px; }
        .add-subtask-form { display: flex; gap: 6px; align-items: center; margin-top: 4px; }
        .subtask-input { border: 1px solid var(--border-color); border-radius: 4px; padding: 2px 8px; font-size: 11px; outline: none; }
        .sub-save-btn { background: var(--primary-blue); color: #FFF; border: none; border-radius: 4px; padding: 2px 8px; font-size: 11px; cursor: pointer; }
        .sub-cancel-btn { background: none; border: none; font-size: 11px; color: var(--text-muted); cursor: pointer; }

        /* Category Statistics Summary Section with 20 Morandi Colors */
        .category-stats-summary-card { padding: 20px 24px; }
        .stats-head-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .stats-head-bar .left { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 600; }
        .config-cats-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; color: var(--text-muted); font-size: 12px; cursor: pointer; }

        .cat-config-panel { background: var(--bg-warm-paper); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px; }
        .cat-config-panel h5 { font-size: 13px; font-weight: 600; margin-bottom: 8px; }

        .cat-form { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
        .cat-name-input { border: 1px solid var(--border-color); border-radius: var(--radius-full); padding: 6px 14px; font-size: 12px; flex: 1; outline: none; }
        .selected-color-preview { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: var(--shadow-sm); }
        .save-cat-btn { background: var(--accent-brown); color: #FFF; border: none; border-radius: var(--radius-full); padding: 6px 16px; font-size: 12px; cursor: pointer; }

        /* 20 MUJI Morandi Color Swatches Grid */
        .morandi-palette-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px; padding-top: 6px; }
        .morandi-color-swatch {
          aspect-ratio: 1; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: transform 0.15s, box-shadow 0.15s; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
        }
        .morandi-color-swatch:hover { transform: scale(1.15); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); }
        .morandi-color-swatch.active { transform: scale(1.2); box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px var(--primary-blue); }

        .category-stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
        .cat-stat-box {
          background: #FAFAFA; border-top: 3px solid var(--primary-blue); border-right: 1px solid var(--border-color-light);
          border-bottom: 1px solid var(--border-color-light); border-left: 1px solid var(--border-color-light);
          border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px;
        }
        .cat-box-name { font-size: 13px; font-weight: 600; }
        .cat-box-numbers { font-size: 11px; color: var(--text-muted); display: flex; justify-content: space-between; }
        .completed-text strong { color: #27AE60; }
      `}</style>
    </div>
  );
};
