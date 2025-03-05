import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IGetAllTaskReq, IGetAllTaskRes, TaskService } from '@tungle/core/apis/task.service';
import { IssueStatus } from '@tungle/interface/issue';
import { AuthQuery } from '@tungle/project/auth/auth.query';
import { Chart } from 'chart.js';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public chart1: any;
  public chart2: any;
  public listBox: IListBox[] = [];
  dashboardData!: IDashboardData;

  constructor(
    private taskService: TaskService,
    public authQuery: AuthQuery,
    private router: Router
  ) {}

  async ngOnInit() {
    this.authQuery.user$
      .subscribe((user) => {
        if (user.role === 'user') {
          this.router.navigate(['/main/projects/list']);
        }
      })
      // .unsubscribe();

    await this.getDashboardData();
    this.createPieChart();
    this.createLineChart();
  }

  createPieChart() {
    this.chart1 = new Chart('pieChart', {
      type: 'doughnut',
      data: {
        labels: ['Chưa xử lý', 'Đã hoàn thành', 'Đang thực hiện'],
        datasets: [
          {
            data: [
              this.dashboardData.pendingTasksCount,
              this.dashboardData.doneTasksCount,
              this.dashboardData.processTasksCount
            ],
            backgroundColor: ['#99FFEB', '#0E7964', '#0EAF8F'],
            hoverBackgroundColor: ['#99FFEB', '#0E7964', '#0EAF8F']
          }
        ]
      },
      options: {
        responsive: true,
        cutout: '50%',
        plugins: {
          legend: {
            position: 'right'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                var dataset = context.dataset;
                var label = dataset.label || '';
                var value = dataset.data[context.dataIndex];
                var total = dataset.data.reduce(function (previousValue, currentValue) {
                  return previousValue + currentValue;
                });
                var percentage = Math.floor((value / total) * 100 + 0.5);
                return label + ' ' + percentage + '%';
              }
            }
          }
        }
      }
    });
  }

  createLineChart() {
    this.chart2 = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
        datasets: [
          {
            // label: 'Số lượng công việc',
            data: [
              this.dashboardData.weeklyData.mondayTasksCount,
              this.dashboardData.weeklyData.tuesdayTasksCount,
              this.dashboardData.weeklyData.wednesdayTasksCount,
              this.dashboardData.weeklyData.thursdayTasksCount,
              this.dashboardData.weeklyData.fridayTasksCount,
              this.dashboardData.weeklyData.saturdayTasksCount
            ],
            borderColor: '#0EAF8F',
            fill: false,
            pointBackgroundColor: '#0EAF8F'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false // Ẩn bỏ chú thích
          }
        }
      }
    });
  }

  async getDashboardData() {
    const body: IGetAllTaskReq = {
      page: 1,
      pageSize: 99999,
      project_id: null,
      assigned_by: null
    };
    const res = await this.taskService.getAllTasks(body);
    const taskDatas = res.issues;

    // task count data
    const allTasksCount = taskDatas.length;
    const pendingTasksCount = taskDatas.filter(
      (item) => item.status === IssueStatus.BACKLOG || item.status === IssueStatus.NEW
    ).length;
    const processTasksCount = taskDatas.filter(
      (item) =>
        item.status === IssueStatus.IN_PROGRESS ||
        // item.status === IssueStatus.READY_TO_TEST ||
        item.status === IssueStatus.TESTING
    ).length;
    const doneTasksCount = taskDatas.filter((item) => item.status === IssueStatus.DONE).length;
    const rejectTasksCount = taskDatas.filter((item) => item.status === IssueStatus.REJECT).length;

    //weekly data
    const weeklyData = this.groupByWeekday(res);

    // dashboard data
    this.dashboardData = {
      allTasksCount: allTasksCount,
      pendingTasksCount: pendingTasksCount,
      processTasksCount: processTasksCount,
      doneTasksCount: doneTasksCount,
      rejectTasksCount: rejectTasksCount,
      weeklyData: {
        mondayTasksCount: weeklyData['Monday'].length,
        tuesdayTasksCount: weeklyData['Tuesday'].length,
        wednesdayTasksCount: weeklyData['Wednesday'].length,
        thursdayTasksCount: weeklyData['Thursday'].length,
        fridayTasksCount: weeklyData['Friday'].length,
        saturdayTasksCount: weeklyData['Saturday'].length
      }
    };

    this.listBox = [
      {
        title: 'Công việc',
        count: this.dashboardData.allTasksCount,
        percent: 10,
        status: 1
      },
      {
        title: 'Chưa xử lý',
        count: this.dashboardData.pendingTasksCount,
        percent: 15,
        status: 0
      },
      {
        title: 'Đã xử lý',
        count: this.dashboardData.doneTasksCount,
        percent: 5,
        status: 1
      },
      {
        title: 'Đang xử lý',
        count: this.dashboardData.processTasksCount,
        percent: 10,
        status: 1
      },
      {
        title: 'Hủy bỏ',
        count: this.dashboardData.rejectTasksCount,
        percent: -2,
        status: 0
      }
    ];

    console.log(this.dashboardData);
  }

  getStartAndEndOfWeek() {
    const today = new Date();
    const dayOfWeek = today.getUTCDay(); // Lấy ngày trong tuần (0: Chủ nhật, 1: Thứ 2,...)

    // Tính ngày bắt đầu của tuần (Thứ 2)
    const startOfWeek = new Date(today);
    startOfWeek.setUTCDate(today.getUTCDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Nếu hôm nay Chủ nhật, trừ 6 ngày, nếu không trừ dayOfWeek - 1
    startOfWeek.setUTCHours(0, 0, 0, 0); // Thiết lập giờ là 00:00:00

    // Tính ngày kết thúc của tuần (Chủ nhật)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6); // Cộng thêm 6 ngày để đến Chủ nhật
    endOfWeek.setUTCHours(23, 59, 59, 999); // Thiết lập giờ là 23:59:59

    return { startOfWeek, endOfWeek };
  }

  groupByWeekday(arr: IGetAllTaskRes) {
    const { startOfWeek, endOfWeek } = this.getStartAndEndOfWeek();

    // Tạo các mảng rỗng cho mỗi ngày trong tuần (từ Thứ 2 đến Thứ 7)
    const groupedIdTask: { [key: string]: number[] } = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: []
    };

    arr.issues.forEach((item) => {
      const date = new Date(item.createdAt); // Chuyển đổi chuỗi ngày ISO thành đối tượng Date
      const dayOfWeek = date.getUTCDay(); // Lấy số ngày trong tuần (0: Chủ nhật, 1: Thứ 2,...)

      // Lọc chỉ các ngày trong tuần hiện tại
      if (date >= startOfWeek && date <= endOfWeek) {
        switch (dayOfWeek) {
          case 1:
            groupedIdTask['Monday'].push(item.id);
            break;
          case 2:
            groupedIdTask['Tuesday'].push(item.id);
            break;
          case 3:
            groupedIdTask['Wednesday'].push(item.id);
            break;
          case 4:
            groupedIdTask['Thursday'].push(item.id);
            break;
          case 5:
            groupedIdTask['Friday'].push(item.id);
            break;
          case 6:
            groupedIdTask['Saturday'].push(item.id);
            break;
          default:
            break; // Không cần làm gì với Chủ nhật
        }
      }
    });

    return groupedIdTask;
  }
}

interface IDashboardData {
  allTasksCount: number; // số lượng tất cả công việc
  pendingTasksCount: number; // số lượng công việc chưa xử lý
  processTasksCount: number; // số lượng công việc đang xử lý
  doneTasksCount: number; // số lượng công việc đã xử lý
  rejectTasksCount: number; // số lượng công việc hủy bỏ
  weeklyData: {
    mondayTasksCount: number;
    tuesdayTasksCount: number;
    wednesdayTasksCount: number;
    thursdayTasksCount: number;
    fridayTasksCount: number;
    saturdayTasksCount: number;
  };
}

interface IListBox {
  title: string;
  count: number;
  percent: number;
  status: number;
}
